
// declarations.d.ts
// dev notes: TS bude chápat import .svg jako komponentu
declare module '*.svg' {
  import * as React from 'react'
    import { SvgProps } from 'react-native-svg'
  const content: React.FC<SvgProps>
  export default content
}