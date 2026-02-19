import { Link } from 'expo-router'
import React, { useMemo } from 'react'
import { FlatList, Pressable, Text, useWindowDimensions, View } from 'react-native'

import { getLessons, getLessonStats } from '../../src/domain/exercises'
import { useAuth } from '../../src/auth/AuthContext'
import { PositionPreview } from '../../src/ui/PositionPreview'

export default function LessonsScreen() {
  const lessons = getLessons()
  const { user } = useAuth()
  const { width } = useWindowDimensions()

  // Responsive columns (mobile 1, tablet 2, desktop 3)
  const columns = useMemo(() => {
    if (width >= 1100) return 3
    if (width >= 720) return 2
    return 1
  }, [width])

  const contentPadding = 18
  const gap = 14
  const cardWidth =
    Math.floor((width - contentPadding * 2 - gap * (columns - 1)) / columns)

  return (
    <View style={{ flex: 1, backgroundColor: '#F6F7FB' }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: contentPadding,
          paddingTop: 14,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(0,0,0,0.06)',
          backgroundColor: '#FFFFFF',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={{ fontSize: 14, fontWeight: '800', opacity: 0.7 }}>
            ReChess
          </Text>
          <Text style={{ fontSize: 12, opacity: 0.55 }}>
            {user?.name ?? user?.email}
          </Text>
        </View>

        <Link href="/profile" asChild>
          <Pressable
            style={{
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.15)',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700' }}>My Profile</Text>
          </Pressable>
        </Link>
      </View>

      <FlatList
        data={lessons}
        key={columns} // important: re-render layout when columns change
        numColumns={columns}
        contentContainerStyle={{
          padding: contentPadding,
          gap,
        }}
        columnWrapperStyle={columns > 1 ? { gap } : undefined}
        renderItem={({ item: lesson }) => {
          const stats = getLessonStats(lesson)
          const fen = lesson.exercises[0]?.fen ?? ''

          return (
            <Link
              href={`/lesson/${lesson.lessonId}` as any}
              style={{
                width: cardWidth,
                borderRadius: 18,
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.06)',
                padding: 14,
              }}
            >
              <View style={{ gap: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: '900' }}>
                  {lesson.title}
                </Text>

                {!!lesson.description ? (
                  <Text style={{ opacity: 0.75, lineHeight: 18 }}>
                    {lesson.description}
                  </Text>
                ) : null}

                <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                  <Text style={{ opacity: 0.75 }}>
                    {stats.exerciseCount} exercises
                  </Text>
                  <Text style={{ opacity: 0.75 }}>
                    {stats.totalUserMoves} moves
                  </Text>
                  <Text style={{ opacity: 0.75 }}>
                    {stats.totalPlies} plies
                  </Text>
                </View>

                <View style={{ alignSelf: 'flex-start' }}>
                  <PositionPreview
                    fen={fen}
                    size={Math.min(220, Math.max(150, cardWidth - 28))}
                  />
                </View>

                <Text style={{ opacity: 0.55, fontWeight: '700' }}>
                  Open →
                </Text>
              </View>
            </Link>
          )
        }}
      />
    </View>
  )
}
