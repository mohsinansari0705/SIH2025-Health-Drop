import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Profile } from '../types/profile';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

const { width } = Dimensions.get('window');

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Signup form fields
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Profile['role']>('volunteer');
  const [organization, setOrganization] = useState('');
  const [location, setLocation] = useState('');

  // OTP related state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const roles: { value: Profile['role']; label: string }[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'clinic', label: 'Clinic' },
    { value: 'asha_worker', label: 'ASHA Worker' },
    { value: 'volunteer', label: 'Volunteer' },
  ];

  const isValidEmail = (text: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
  };

  const isValidPhone = (text: string) => {
    return /^\+?[\d\s-()]{10,15}$/.test(text.replace(/\s/g, ''));
  };

  const handleAuth = async () => {
    if (isLogin) {
      // For login, only use email (remove phone login for now)
      if (!email || !password) {
        Alert.alert('Error', 'Please enter email and password');
        return;
      }
      if (!isValidEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }
    } else {
      if (!email || !password || !fullName || !organization || !location) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      if (!isValidEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }
    }

    setLoading(true);
    
    try {
      if (isLogin) {
        // Login with email only
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          Alert.alert('Login Error', error.message);
        } else {
          onAuthSuccess();
        }
      } else {
        // First create user with password for future logins
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: undefined, // Disable email confirmation
            data: {
              full_name: fullName,
              role,
              organization,
              location,
              phone,
            }
          }
        });

        if (signUpError) {
          Alert.alert('Sign Up Error', signUpError.message);
          return;
        }

        // Then send OTP for verification (without creating another user)
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: email,
        });
        
        if (otpError) {
          Alert.alert('OTP Error', otpError.message);
        } else {
          setUserEmail(email);
          setShowOtpModal(true);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!otpCode || otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setOtpLoading(true);
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: userEmail,
        token: otpCode,
        type: 'email'
      });
      
      if (error) {
        Alert.alert('OTP Error', error.message);
      } else if (data.user) {
        // Check if profile already exists (might be created by trigger)
        const { data: existingProfile, error: profileCheckError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileCheckError && profileCheckError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              full_name: fullName,
              role,
              organization,
              location,
              created_at: new Date().toISOString(),
              is_active: true,
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }
        }

        setShowOtpModal(false);
        setShowSuccessModal(true);
        setOtpCode('');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error('OTP verification error:', error);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSuccessNext = () => {
    setShowSuccessModal(false);
    // Reset form
    setEmail('');
    setPassword('');
    setFullName('');
    setOrganization('');
    setLocation('');
    setPhone('');
    setIsLogin(true);
    onAuthSuccess();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Image 
            source={require('../assets/app_logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Health Drop</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Welcome Back!' : 'Join Our Community'}
          </Text>
        </View>

        <View style={styles.formContainer}>
          {isLogin ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Role *</Text>
                <View style={styles.roleContainer}>
                  {roles.map((roleOption) => (
                    <TouchableOpacity
                      key={roleOption.value}
                      style={[
                        styles.roleButton,
                        role === roleOption.value && styles.roleButtonSelected,
                      ]}
                      onPress={() => setRole(roleOption.value)}
                    >
                      <Text
                        style={[
                          styles.roleButtonText,
                          role === roleOption.value && styles.roleButtonTextSelected,
                        ]}
                      >
                        {roleOption.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Organization *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your organization"
                  value={organization}
                  onChangeText={setOrganization}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Location *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your location"
                  value={location}
                  onChangeText={setLocation}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Create a strong password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                />
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => {
              setIsLogin(!isLogin);
              // Clear form when switching
              setEmail('');
              setPhone('');
              setPassword('');
              setFullName('');
              setOrganization('');
              setLocation('');
            }}
          >
            <Text style={styles.switchText}>
              {isLogin
                ? "Don't have an account? "
                : 'Already have an account? '}
              <Text style={styles.switchTextBold}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* OTP Verification Modal */}
      <Modal
        visible={showOtpModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOtpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Verification Code</Text>
            <Text style={styles.modalSubtitle}>
              We've sent a 6-digit verification code to {userEmail}
            </Text>
            
            <View style={styles.otpContainer}>
              <TextInput
                style={styles.otpInput}
                value={otpCode}
                onChangeText={setOtpCode}
                placeholder="000000"
                keyboardType="numeric"
                maxLength={6}
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, otpLoading && styles.buttonDisabled]}
              onPress={handleOtpVerification}
              disabled={otpLoading}
            >
              {otpLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.primaryButtonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowOtpModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.successCheckmark}>✓</Text>
            </View>
            
            <Text style={styles.modalTitle}>Account Created Successfully!</Text>
            <Text style={styles.modalSubtitle}>
              Your account has been created and verified. You can now start using HealthDrop.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSuccessNext}
            >
              <Text style={styles.primaryButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafe',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#438edaff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#f8fafe',
    color: '#2c3e50',
  },
  orText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 10,
  },
  roleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    backgroundColor: '#f8fafe',
  },
  roleButtonSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  roleButtonText: {
    color: '#7f8c8d',
    fontSize: 14,
    fontWeight: '500',
  },
  roleButtonTextSelected: {
    color: 'white',
  },
  primaryButton: {
    backgroundColor: '#27ae60',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#27ae60',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 25,
    alignItems: 'center',
  },
  switchText: {
    color: '#7f8c8d',
    fontSize: 16,
  },
  switchTextBold: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  otpContainer: {
    width: '100%',
    marginBottom: 25,
  },
  otpInput: {
    borderWidth: 2,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    padding: 20,
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 8,
    fontWeight: 'bold',
    color: '#2c3e50',
    backgroundColor: '#f8fafe',
  },
  cancelButton: {
    marginTop: 15,
    padding: 15,
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '500',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successCheckmark: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
});