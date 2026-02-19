import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'

import * as ApiClient from '@/src/auth/apiClient'
import { getTokens, saveTokens, SESSION_EXPIRED_MSG } from '@/src/auth/tokenStorage'
import type { BackendUser, LessonProgressItem, UserProgress } from '@/src/auth/types'
import { useAuth } from '@/src/auth/AuthContext'

// ── helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso?: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// ── sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        fontSize: 13,
        fontWeight: '700',
        opacity: 0.55,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 8,
        marginTop: 20,
      }}
    >
      {children}
    </Text>
  )
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.06)',
      }}
    >
      <Text style={{ flex: 1, opacity: 0.6, fontSize: 14 }}>{label}</Text>
      <Text style={{ flex: 2, fontWeight: '600', fontSize: 14 }}>{value || '—'}</Text>
    </View>
  )
}

function ProgressRow({ item }: { item: LessonProgressItem }) {
  return (
    <View
      style={{
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.06)',
      }}
    >
      <Text style={{ fontWeight: '700', fontSize: 14 }}>{item.lessonId}</Text>
      <Text style={{ opacity: 0.6, fontSize: 12 }}>
        {item.status} · last played {formatDate(item.lastPlayedAt)}
        {item.completedAt ? ` · completed ${formatDate(item.completedAt)}` : ''}
      </Text>
    </View>
  )
}

// ── main screen ──────────────────────────────────────────────────────────────

export function ProfileScreen() {
  const { signOut, deleteAccount, accessToken } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<BackendUser | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Fetches /me and /me/progress, refreshing on 401 once.
  const fetchData = useCallback(async () => {
    setLoading(true)
    setLoadError(null)

    const tokens = getTokens()
    let token = tokens?.accessToken ?? accessToken
    if (!token) {
      setLoadError('Not authenticated.')
      setLoading(false)
      return
    }

    async function tryFetch(tok: string) {
      const [p, pr] = await Promise.all([
        ApiClient.getMe(tok),
        ApiClient.getMyProgress(tok),
      ])
      setProfile(p)
      setProgress(pr)
    }

    try {
      await tryFetch(token)
    } catch (err: any) {
      if (err?.status === 401 && tokens?.refreshToken) {
        try {
          const refreshed = await ApiClient.refreshSession(tokens.refreshToken)
          saveTokens({ accessToken: refreshed.accessToken, refreshToken: tokens.refreshToken })
          await tryFetch(refreshed.accessToken)
        } catch {
          setLoadError(SESSION_EXPIRED_MSG)
          signOut()
        }
      } else {
        setLoadError(`Failed to load profile: ${String(err?.message ?? err)}`)
      }
    } finally {
      setLoading(false)
    }
  }, [accessToken, signOut])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all progress. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true)
            try {
              await deleteAccount()
              setSuccessMessage('Your account has been deleted.')
              router.replace('/')
            } catch (err: any) {
              Alert.alert('Error', String(err?.message ?? 'Failed to delete account.'))
            } finally {
              setIsDeleting(false)
            }
          },
        },
      ]
    )
  }, [deleteAccount, router])

  // ── render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (loadError) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ color: '#B91C1C', textAlign: 'center', marginBottom: 16 }}>
          {loadError}
        </Text>
        <Pressable
          onPress={() => { void fetchData() }}
          style={{
            borderRadius: 10,
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: '#111827',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Retry</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F6F7FB' }}
      contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
    >
      {successMessage ? (
        <Text
          style={{
            backgroundColor: '#DCFCE7',
            color: '#166534',
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            fontWeight: '600',
          }}
        >
          {successMessage}
        </Text>
      ) : null}

      <SectionTitle>Profile</SectionTitle>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 14,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.06)',
          paddingHorizontal: 14,
        }}
      >
        <InfoRow label="Email" value={profile?.email} />
        <InfoRow label="Name" value={profile?.displayName} />
        <InfoRow label="Role" value={profile?.role} />
        <InfoRow label="Member since" value={formatDate(profile?.createdAt)} />
        <InfoRow label="Last login" value={formatDate(profile?.lastLoginAt)} />
      </View>

      <SectionTitle>Progress</SectionTitle>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 14,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.06)',
          paddingHorizontal: 14,
        }}
      >
        <View
          style={{
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0,0,0,0.06)',
          }}
        >
          <Text style={{ fontWeight: '700' }}>
            Lessons completed:{' '}
            <Text style={{ color: '#2563EB' }}>{progress?.completedCount ?? 0}</Text>
          </Text>
        </View>
        {progress?.lessons && progress.lessons.length > 0 ? (
          progress.lessons.map((item) => (
            <ProgressRow key={item.lessonId} item={item} />
          ))
        ) : (
          <Text style={{ opacity: 0.55, paddingVertical: 10 }}>No lessons started yet.</Text>
        )}
      </View>

      <SectionTitle>Account</SectionTitle>
      <View style={{ gap: 10 }}>
        <Pressable
          onPress={signOut}
          style={{
            borderRadius: 12,
            paddingVertical: 13,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.15)',
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontWeight: '700' }}>Logout</Text>
        </Pressable>

        <Pressable
          onPress={handleDeleteAccount}
          disabled={isDeleting}
          style={{
            borderRadius: 12,
            paddingVertical: 13,
            backgroundColor: '#FEF2F2',
            borderWidth: 1,
            borderColor: '#FECACA',
            alignItems: 'center',
            opacity: isDeleting ? 0.6 : 1,
          }}
        >
          {isDeleting ? (
            <ActivityIndicator color="#B91C1C" />
          ) : (
            <Text style={{ fontWeight: '700', color: '#B91C1C' }}>Delete Account</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  )
}
