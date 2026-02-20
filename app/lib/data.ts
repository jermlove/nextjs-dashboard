
import * as authSchema from '../../db/auth-schema';
import { eq, ilike, or, sql as dsql, and } from 'drizzle-orm';
import { db } from '@/app/lib/db';
import {
  CustomerField,
  CustomersTableType,
  FormattedCustomersTable,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  User,
} from './definitions';
import { formatCurrency } from './utils';


// Fetch a user by email (for profile/meta-card)
export async function fetchUserByEmail(email: string) {
  try {
    const data = await db.select({ id: authSchema.user.id, name: authSchema.user.name, email: authSchema.user.email, image: authSchema.user.image }) 
      .from(authSchema.user)
      .where(eq(authSchema.user.email, email))
      .limit(1);
    return data[0] as User || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)
    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const data = await db.select().from(authSchema.revenue);
    console.log('Data fetch completed after 3 seconds.');
    return data as Revenue[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await db
      .select({
        amount: authSchema.invoice.amount,
        name: authSchema.customer.name,
        image_url: authSchema.customer.image_url,
        email: authSchema.customer.email,
        id: authSchema.invoice.id,
      })
      .from(authSchema.invoice)
      .innerJoin(authSchema.customer, eq(authSchema.invoice.customerId, authSchema.customer.id))
      .orderBy(dsql`${authSchema.invoice.date} DESC`)
      .limit(5);
    const latestInvoices = (data as LatestInvoiceRaw[]).map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    const [invoiceCount, customerCount, invoiceStatus] = await Promise.all([
      db.select({ count: dsql`count(*)` }).from(authSchema.invoice),
      db.select({ count: dsql`count(*)` }).from(authSchema.customer),
      db.select({
        paid: dsql`SUM(CASE WHEN ${authSchema.invoice.status} = 'paid' THEN ${authSchema.invoice.amount} ELSE 0 END)`,
        pending: dsql`SUM(CASE WHEN ${authSchema.invoice.status} = 'pending' THEN ${authSchema.invoice.amount} ELSE 0 END)`,
      }).from(authSchema.invoice),
    ]);
    const numberOfInvoices = Number(invoiceCount[0]?.count ?? '0');
    const numberOfCustomers = Number(customerCount[0]?.count ?? '0');
    const totalPaid = Number(invoiceStatus[0]?.paid ?? 0);
    const totalPending = Number(invoiceStatus[0]?.pending ?? 0);
    const totalPaidInvoices = formatCurrency(totalPaid);
    const totalPendingInvoices = formatCurrency(totalPending);
    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const invoices = await db
      .select({
        id: authSchema.invoice.id,
        amount: authSchema.invoice.amount,
        date: authSchema.invoice.date,
        status: authSchema.invoice.status,
        name: authSchema.customer.name,
        email: authSchema.customer.email,
        image_url: authSchema.customer.image_url,
      })
      .from(authSchema.invoice)
      .innerJoin(authSchema.customer, eq(authSchema.invoice.customerId, authSchema.customer.id))
      .where(
        or(
          ilike(authSchema.customer.name, `%${query}%`),
          ilike(authSchema.customer.email, `%${query}%`),
          ilike(dsql`${authSchema.invoice.amount}::text`, `%${query}%`),
          ilike(dsql`${authSchema.invoice.date}::text`, `%${query}%`),
          ilike(authSchema.invoice.status, `%${query}%`)
        )
      )
      .orderBy(dsql`${authSchema.invoice.date} DESC`)
      .limit(ITEMS_PER_PAGE)
      .offset(offset);
    return invoices as InvoicesTable[];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await db
      .select({ count: dsql`count(*)` })
      .from(authSchema.invoice)
      .innerJoin(authSchema.customer, eq(authSchema.invoice.customerId, authSchema.customer.id))
      .where(
        or(
          ilike(authSchema.customer.name, `%${query}%`),
          ilike(authSchema.customer.email, `%${query}%`),
          ilike(dsql`${authSchema.invoice.amount}::text`, `%${query}%`),
          ilike(dsql`${authSchema.invoice.date}::text`, `%${query}%`),
          ilike(authSchema.invoice.status, `%${query}%`)
        )
      );
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await db
      .select({
        id: authSchema.invoice.id,
        customer_id: authSchema.invoice.customerId,
        amount: authSchema.invoice.amount,
        status: authSchema.invoice.status,
      })
      .from(authSchema.invoice)
      .where(eq(authSchema.invoice.id, id));
    const invoice = (data as InvoiceForm[]).map((invoice) => ({
      ...invoice,
      amount: invoice.amount / 100,
    }));
    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await db
      .select({ id: authSchema.customer.id, name: authSchema.customer.name })
      .from(authSchema.customer)
      .orderBy(authSchema.customer.name);
    return customers as CustomerField[];
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await db
      .select({
        id: authSchema.customer.id,
        name: authSchema.customer.name,
        email: authSchema.customer.email,
        image_url: authSchema.customer.image_url,
        total_invoices: dsql`COUNT(${authSchema.invoice.id})`,
        total_pending: dsql`SUM(CASE WHEN ${authSchema.invoice.status} = 'pending' THEN ${authSchema.invoice.amount} ELSE 0 END)`,
        total_paid: dsql`SUM(CASE WHEN ${authSchema.invoice.status} = 'paid' THEN ${authSchema.invoice.amount} ELSE 0 END)`,
      })
      .from(authSchema.customer)
      .leftJoin(authSchema.invoice, eq(authSchema.customer.id, authSchema.invoice.customerId))
      .where(
        or(
          ilike(authSchema.customer.name, `%${query}%`),
          ilike(authSchema.customer.email, `%${query}%`)
        )
      )
      .groupBy(
        authSchema.customer.id,
        authSchema.customer.name,
        authSchema.customer.email,
        authSchema.customer.image_url
      )
      .orderBy(authSchema.customer.name);
    const customers = (data as CustomersTableType[]).map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));
    return customers as FormattedCustomersTable[];
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchCustomersPages(query: string) {
  try {
    const data = await db
      .select({ count: dsql`count(*)` })
      .from(authSchema.customer)
      .where(
        or(
          ilike(authSchema.customer.name, `%${query}%`),
          ilike(authSchema.customer.email, `%${query}%`)
        )
      );
    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }
}
