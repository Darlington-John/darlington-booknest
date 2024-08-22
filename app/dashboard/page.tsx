"use client"
import { useEffect, useState } from "react";

const Dashboard = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch('/api/user', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            // Handle errors, e.g., redirect to login
            window.location.href = '/login';
          }
        } catch (err) {
          console.error('Failed to fetch user', err);
          window.location.href = '/login'; // Redirect to login on error
        } finally {
          setLoading(false);
        }
      };
  
      fetchUser();
    }, []);
  
    if (loading) return <p>Loading...</p>;
    return (  <section>
        <h1 className="text-blue text-5xl">
{user.email}
        </h1>
    </section>);
}
 
export default Dashboard;