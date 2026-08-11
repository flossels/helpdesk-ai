# HelpDesk AI — Companion Code

This repository contains the complete source code for the practice project
in [Next.js: The Comprehensive Guide](https://leanpub.com/comprehensive-nextjs-guide).

Each chapter has its own branch, so you can jump in at any point or compare
your implementation with the reference code:

```bash
git clone https://github.com/flossels/helpdesk-ai.git
cd helpdesk-ai
git checkout chapter-12
pnpm install
```

Branch names are unpadded: `chapter-7`, not `chapter-07`.

## Part I — Fundamentals

These branches hold the standalone TypeScript and React exercises from Part I.
The HelpDesk AI project itself starts at `chapter-5`.

- `chapter-1` — TypeScript: Quick Start for Experienced Developers
- `chapter-2` — Modern JavaScript for TypeScript Developers
- `chapter-3` — React: Fundamentals and Mental Model
- `chapter-4` — Advanced React

## Part II — Next.js Core Concepts

- `chapter-5` — Getting Started and Project Structure
- `chapter-6` — Routing and Navigation
- `chapter-7` — Understanding Rendering Strategies
- `chapter-8` — Data Fetching
- `chapter-9` — Styling and UI Components

## Part III — Full-Stack Architecture

- `chapter-10` — Project Architecture and Data Model
- `chapter-11` — Database and ORM
- `chapter-12` — Authentication and Authorization
- `chapter-13` — Forms, Validation, and File Management
- `chapter-14` — Email, State Management, and Real-Time

## Part IV — AI Features with the Vercel AI SDK

- `chapter-15` — Introduction to the Vercel AI SDK
- `chapter-16` — Text Generation and Streaming
- `chapter-17` — Building a Chat Interface
- `chapter-18` — Structured Output and Tool Calling
- `chapter-19` — Retrieval-Augmented Generation (RAG)

## Part V — Production and Operations

- `chapter-20` — Testing
- `chapter-21` — Performance Optimization
- `chapter-22` — Security
- `chapter-23` — Monitoring, Analytics, and Observability
- `chapter-24` — Deployment on Vercel
- `chapter-25` — Self-Hosting as an Alternative

## Part VI — Advanced Topics

- `chapter-26` — SEO and Accessibility
- `chapter-27` — Internationalization (i18n)
- `chapter-28` — The Next.js Ecosystem and the Future
- `chapter-29` — AI-Assisted Development with Claude Code

`chapter-29` is the final state of the project.

## Setup

From `chapter-5` onward, each branch carries its own `.env.example` listing the
variables that branch needs. Copy it to `.env.local` and fill in the values; the
chapter that introduces each variable explains where it comes from. From
`chapter-11` onward the project also needs a PostgreSQL database, which the
branch's `docker-compose.yml` starts with `docker compose up -d`.

## Get the book

📖 [leanpub.com/comprehensive-nextjs-guide](https://leanpub.com/comprehensive-nextjs-guide)
