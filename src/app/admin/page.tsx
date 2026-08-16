import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  if (authenticated) {
    redirect('/admin/dashboard');
  } else {
    redirect('/admin/login');
  }
}
