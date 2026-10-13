import { styled } from '@linaria/react'

export const DocumentStyled = styled.html`
  color: #20232b;
  background: #f8f7f3;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
  font-size: 16px;
  line-height: 1.65;
  scroll-padding-top: 6rem;
  & * {
    box-sizing: border-box;
  }
  & body {
    margin: 0;
  }
  & a {
    color: inherit;
    text-underline-offset: 0.22em;
  }
  & a:focus-visible,
  & button:focus-visible {
    outline: 3px solid #3451d1;
    outline-offset: 5px;
  }
  & ::selection {
    background: #dce2ff;
  }
  & h1,
  & h2,
  & h3 {
    line-height: 1.15;
    text-wrap: balance;
  }
  & h1 {
    letter-spacing: -0.045em;
  }
  & img {
    max-width: 100%;
    height: auto;
  }
  & button,
  & input {
    font: inherit;
  }
  @media (prefers-reduced-motion: no-preference) {
    scroll-behavior: smooth;
  }
`
export const Frame = styled.div`
  & .skip-link {
    position: fixed;
    top: -8rem;
    left: 1rem;
    z-index: 10;
    opacity: 0;
    pointer-events: none;
    padding: 1rem;
    background: white;
  }
  & .skip-link:focus {
    top: 1rem;
    opacity: 1;
    pointer-events: auto;
  }
  & main {
    min-height: 65vh;
  }
  & .wrap {
    width: min(100% - 2.5rem, 1180px);
    margin-inline: auto;
  }
  & .eyebrow {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #3451d1;
    font-weight: 700;
  }
  & .text-link {
    color: #3451d1;
    font-weight: 600;
  }
  @media (min-width: 48rem) {
    & .wrap {
      width: min(100% - 5rem, 1180px);
    }
  }
`
export const Header = styled.header`
  border-bottom: 1px solid #dedfdc;
  background: #f8f7f3;
  & .wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    min-height: 82px;
  }
  & .brand {
    text-decoration: none;
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing: -0.04em;
  }
  & .brand span {
    color: #3451d1;
  }
  & nav {
    display: flex;
    gap: 1rem;
    font-size: 0.85rem;
  }
  & nav a {
    text-decoration: none;
    padding-block: 0.75rem;
  }
  & nav a[aria-current] {
    color: #3451d1;
    text-decoration: underline;
  }
`
export const Footer = styled.footer`
  margin-top: 5rem;
  border-top: 1px solid #dedfdc;
  padding-block: 2.5rem;
  & .wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1.5rem;
  }
  & p {
    margin: 0;
    font-size: 0.85rem;
    color: #606571;
    max-width: 32rem;
  }
  & a {
    font-size: 0.85rem;
  }
`
export const Intro = styled.section`
  padding-block: 3rem;
  & h1 {
    font-size: clamp(2.5rem, 6vw, 5rem);
    max-width: 18ch;
    margin: 1rem 0 1.5rem;
    overflow-wrap: anywhere;
  }
  & .lead {
    font-size: clamp(1.05rem, 2vw, 1.3rem);
    max-width: 48rem;
    color: #535967;
  }
  & .hero-grid {
    display: grid;
    gap: 2rem;
  }
  & .cycle {
    align-self: end;
    padding: 1.8rem;
    background: #e9edf9;
    border-top: 3px solid #3451d1;
  }
  & .cycle ol {
    padding-left: 1.3rem;
    margin-bottom: 0;
  }
  & .cycle li {
    padding-block: 0.3rem;
  }
  @media (min-width: 60rem) {
    padding-block: 4.5rem;
    & .hero-grid {
      grid-template-columns: 1.6fr 1fr;
      gap: 5rem;
    }
  }
`
export const Article = styled.article`
  max-width: 780px;
  margin-inline: auto;
  overflow-wrap: anywhere;
  & .prose {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 1.15rem;
    line-height: 1.85;
  }
  & .prose p {
    margin: 1.5rem 0;
  }
  & .prose h2,
  & .prose h3 {
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    margin-top: 2.5rem;
  }
  & .prose h2 {
    font-size: 1.7rem;
  }
  & .prose h3 {
    font-size: 1.35rem;
  }
  & .prose a {
    color: #3451d1;
  }
  & .prose li {
    margin-block: 0.6rem;
  }
  & .prose blockquote {
    border-left: 3px solid #3451d1;
    margin-inline: 0;
    padding-left: 1.5rem;
    color: #555d73;
  }
  & .prose pre {
    white-space: pre-wrap;
    background: #eeeee9;
    padding: 1rem;
    font-size: 0.85rem;
  }
  & .prose code {
    font-size: 0.85em;
    overflow-wrap: anywhere;
  }
  & .prose table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85em;
  }
  & .prose td,
  & .prose th {
    padding: 0.5rem;
    border: 1px solid #dedfdc;
  }
  & .byline {
    font-size: 0.85rem;
    color: #666b75;
    border-block: 1px solid #dedfdc;
    padding-block: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.5rem;
  }
`
export const Catalog = styled.section`
  margin-top: 4rem;
  border-top: 1px solid #dedfdc;
  padding-top: 2.5rem;
  & .section-title {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  & h2 {
    margin: 0;
    font-size: 2rem;
    letter-spacing: -0.035em;
  }
  & .cards {
    display: grid;
    gap: 1rem;
  }
  & .card {
    padding: 1.6rem;
    border: 1px solid #dedfdc;
    background: #fff;
  }
  & .card h3 {
    font-size: 1.25rem;
    margin: 0.7rem 0 1rem;
  }
  & .card h3 a {
    text-decoration: none;
  }
  & .card h3 a:hover {
    color: #3451d1;
    text-decoration: underline;
  }
  & .card p {
    color: #5b606b;
    font-size: 0.95rem;
  }
  & .number {
    color: #3451d1;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
  }
  @media (min-width: 48rem) {
    & .cards {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (min-width: 70rem) {
    & .cards {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
`
export const Breadcrumbs = styled.nav`
  padding-top: 2rem;
  font-size: 0.8rem;
  color: #636975;
  & ol {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0;
    margin: 0;
  }
  & li + li::before {
    content: '/';
    margin-right: 0.5rem;
    color: #999;
  }
`
