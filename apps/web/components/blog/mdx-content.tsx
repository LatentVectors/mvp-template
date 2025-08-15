import React from 'react'
import { useMDXComponent } from 'next-contentlayer2/hooks'
import { CodeBlock } from './code-block'

const components = {
  pre: CodeBlock,
  // Add more custom components here as needed
}

interface MDXContentProps {
  code: string
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code)

  return <Component components={components} />
}
