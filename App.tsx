import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './lib/supabase';
import AuthScreen from './components/AuthScreen';
import ProfileSetup from './components/ProfileSetup';
import HelloWorld from './components/HelloWorld';
import { Session } from '@supabase/supabase-js';
import { Profile } from './types/profile';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    // The session will be updated through the auth state change listener
  };

  const handleProfileComplete = () => {
    if (session) {
      fetchProfile(session.user.id);
    }
  };

  if (loading) {
    return <View style={styles.container} />;
  }

  if (!session) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  // Profile is created during signup, so we can go directly to HelloWorld
  // if (!profile) {
  //   return (
  //     <ProfileSetup
  //       userId={session.user.id}
  //       onProfileComplete={handleProfileComplete}
  //     />
  //   );
  // }

  return (
    <View style={styles.container}>
      <HelloWorld userEmail={session.user.email || 'Unknown'} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});