import Link from 'next/link'
import Image, { ImageProps } from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React, { ComponentProps, ReactNode } from 'react'
import remarkGfm from 'remark-gfm'

/* Table */
interface TableData {
  headers: string[]
  rows: ReactNode[][]
}
interface TableProps {
  data: TableData
}
function Table({ data }: TableProps) {
  const headers = data.headers.map((header, i) => <th key={i}>{header}</th>)
  const rows = data.rows.map((row, i) => (
    <tr key={i}>
      {row.map((cell, j) => (
        <td key={j}>{cell}</td>
      ))}
    </tr>
  ))
  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

/* Links */
type AnchorProps = React.ComponentProps<'a'>
function CustomLink(props: AnchorProps) {
  const { href = '', children, ...rest } = props
  if (href.startsWith('/')) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    )
  }
  if (href.startsWith('#')) {
    return <a href={href} {...rest}>{children}</a>
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {children}
    </a>
  )
}

/* Images */
function RoundedImage(props: ImageProps) {
  const { alt, className, ...rest } = props
  return <Image alt={alt} className={`rounded-lg ${className ?? ''}`} {...rest} />
}

/* Inline code */
interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  children: string
}
function Code({ children, ...props }: CodeProps) {
  const codeHTML = highlight(typeof children === 'string' ? children : String(children))
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

/* Utils */
function slugify(str: string): string {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

function extractText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join(' ')
  if (React.isValidElement(node)) {
    const children = (node.props as { children?: ReactNode }).children
    return children ? extractText(children) : ''
  }
  return ''
}

interface HeadingProps {
  children: ReactNode
}

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Heading: React.FC<HeadingProps> = ({ children }) => {
    const slug = slugify(extractText(children))
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
        children,
      ]
    )
  }
  Heading.displayName = `Heading${level}`
  return Heading
}

/* Components map */
const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  Table,
}

type MDXRemoteBaseProps = ComponentProps<typeof MDXRemote>
interface CustomMDXProps extends Omit<MDXRemoteBaseProps, 'components'> {
  components?: Record<string, React.ComponentType<any>>
}

export function CustomMDX(props: CustomMDXProps) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      }}
    />
  )
}
