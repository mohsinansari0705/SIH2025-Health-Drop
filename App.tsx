import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './lib/supabase';
import { ThemeProvider } from './lib/ThemeContext';
import AuthScreen from './components/AuthScreen';
import ProfileSetup from './components/ProfileSetup';
import IndexPage from './pages/IndexPage';
import { Session } from '@supabase/supabase-js';
import { Profile } from './types/profile';

function AppContent() {
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
      // Add a small delay to allow profile creation to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setProfile(data);
      } else {
        // Profile not found, might need to create one
        console.log('No profile found for user:', userId);
        setProfile(null);
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

  // Check if profile exists, if not show ProfileSetup
  if (!profile) {
    return (
      <ProfileSetup
        userId={session.user.id}
        onProfileComplete={handleProfileComplete}
      />
    );
  }

  return (
    <View style={styles.container}>
      <IndexPage userName={session.user.email?.split('@')[0] || 'User'} />
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});