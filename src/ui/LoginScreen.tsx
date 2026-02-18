import { useAuth } from '@/src/auth/AuthContext'
import * as AuthSession from 'expo-auth-session'
import React from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'

export function LoginScreen() {
  const { error, isAuthenticating, signInWithGoogle } = useAuth()
  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'rechessapp' })


  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        backgroundColor: '#F6F7FB',
      }}
    >
      <Text style={{ fontSize: 30, fontWeight: '900', marginBottom: 6 }}>
        ReChess
      </Text>
      <Text selectable style={{ fontSize: 12, opacity: 0.6 }}>
        Redirect URI: {redirectUri}
      </Text>
      <Text style={{ opacity: 0.7, marginBottom: 22 }}>Sign in to continue</Text>

      <Pressable
        onPress={() => {
          void signInWithGoogle()
        }}
        disabled={isAuthenticating}
        style={{
          minWidth: 220,
          borderRadius: 12,
          backgroundColor: '#111827',
          paddingHorizontal: 16,
          paddingVertical: 12,
          alignItems: 'center',
          opacity: isAuthenticating ? 0.65 : 1,
        }}
      >
        {isAuthenticating ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>
            Continue with Google
          </Text>
        )}
      </Pressable>

      {error ? (
        <Text style={{ marginTop: 12, color: '#B91C1C', textAlign: 'center' }}>
          {error}
        </Text>
      ) : null}
    </View>
  )
}
