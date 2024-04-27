import CustomerPortalForm from '@/components/ui/AccountForms/CustomerPortalForm';
import EmailForm from '@/components/ui/AccountForms/EmailForm';
import NameForm from '@/components/ui/AccountForms/NameForm';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { FormEvent } from 'react';

export default async function Account() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single();

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  if (error) {
    console.log(error);
  }

  if (!user) {
    return redirect('/signin');
  }

const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget); // Use the form ref here
  const key = formData.get('key') as string; // Explicitly cast the value to string
  const prompt = formData.get('prompt') as string; // Explicitly cast the value to string

    // Post data to the server-side API
    const response = await fetch('/api/submitContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, prompt }),
    });

    const data = await response.json();
    console.log(data); // Process or use response data as needed.
  };
  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Account
          </h1>
         {subscription && (
        <div className="w-full max-w-3xl m-auto my-8 border rounded-md p border-zinc-700" >
          {/* Replace "Extra Content Here" with whatever special content you want to show */}
          <h2>Special Access Content</h2>
              <form onSubmit={handleSubmit}>
                 <label>
                   Key:
                   <input type="text" name="key" required />
                 </label>
                 <br />
                 <label>
                   Prompt:
                   <input type="text" name="prompt" required />
                 </label>
                 <br />
                 <button type="submit">Submit</button>
              </form>
        </div>
      )}
        </div>
      </div>
      <div className="p-4">
        <CustomerPortalForm subscription={subscription} />
        <NameForm userName={userDetails?.full_name ?? ''} />
        <EmailForm userEmail={user.email} />
      </div>
        
    </section>
  );
}
