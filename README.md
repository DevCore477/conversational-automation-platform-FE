# AI Powered Conversational platform Frontend

AI Powered Conversational platform is an AI-powered communication and automation platform that enables businesses to manage intelligent AI agents for voice calls, WhatsApp conversations, customer support, bookings, campaigns, and automated workflows.

The AI Powered Conversational platform frontend provides a modern web dashboard where businesses can create AI agents, configure conversations, manage calls, monitor analytics, and control their communication operations from a single platform.

---

# Overview

The AI Powered Conversational platform dashboard enables businesses to:

- Create and manage AI voice agents
- Configure AI conversations and workflows
- Manage inbound and outbound calls
- Build conversation flows
- Create and monitor campaigns
- Review customer conversations
- Track call analytics
- Manage teams and permissions
- Configure integrations
- Monitor AI agent performance

The frontend communicates with the AI Powered Conversational platform backend APIs to provide a complete AI communication management experience.

---

# Features

## AI Agent Management

Users can create and configure AI agents according to business requirements.

Features:

- Create AI agents
- Update agent settings
- Configure AI instructions
- Select AI models
- Configure voice settings
- Select languages
- Attach conversation flows
- Attach scripts
- Configure execution modes
- Manage agent status

Example:

```
AI Agent

 ├── Agent Name
 ├── Voice
 ├── Language
 ├── AI Model
 ├── System Prompt
 ├── Conversation Flow
 ├── Script
 └── Execution Mode
```

---

# Conversation Flow Builder

AI Powered Conversational platform provides a structured workflow system to design AI conversations.

Example:

```
Greeting
    |
Understand Customer Intent
    |
Ask Required Questions
    |
Validate Information
    |
Perform Business Action
    |
Confirm Result
    |
Close Conversation
```

Supported flow actions:

- Messages
- Questions
- Conditions
- Validations
- API actions
- Call transfer
- Completion actions

---

# Call Management

The frontend provides complete visibility into AI-powered phone conversations.

Features:

- View incoming calls
- View outgoing calls
- Search calls
- Filter calls
- View call details
- View transcripts
- Track call duration
- Monitor call status

Call lifecycle:

```
Initiating
     |
Queued
     |
Connecting
     |
Active
     |
Completed
```

Possible failure states:

```
Failed
Busy
No Answer
Cancelled
```

---

# Make AI Calls

Users can initiate AI-powered outbound calls directly from the dashboard.

Workflow:

```
Select AI Agent

       ↓

Enter Customer Number

       ↓

Select Script / Flow

       ↓

Start Call

       ↓

Monitor Conversation
```

Users can configure:

- Customer phone number
- AI agent
- Voice
- Script
- Conversation flow
- Custom instructions

---

# Campaign Management

AI Powered Conversational platform supports AI-powered communication campaigns.

Features:

- Create campaigns
- Upload contacts using CSV
- Select AI agent
- Select templates
- Start campaigns
- Monitor progress
- View campaign statistics

Campaign metrics:

- Total contacts
- Calls initiated
- Completed calls
- Failed calls
- Active conversations

---

# Conversation History

Users can review all previous AI conversations.

Available information:

- Customer details
- Call type
- Agent used
- Call status
- Transcript
- Conversation duration
- Date and time
- Conversation metadata

---

# WhatsApp Integration

AI Powered Conversational platform supports AI-powered messaging conversations.

Features:

- Manage WhatsApp conversations
- Configure messaging agents
- Handle customer inquiries
- Automate responses
- Maintain conversation history

---

# Dashboard Analytics

The dashboard provides insights into AI communication performance.

Metrics include:

- Total calls
- Active calls
- Completed conversations
- Failed calls
- Campaign performance
- Agent usage
- Customer interactions

---

# Authentication & Authorization

AI Powered Conversational platform uses secure authentication and authorization.

Features:

- User login
- User registration
- JWT authentication
- Protected routes
- Role-based access control

Roles:

## Admin

Admin users can manage:

- AI agents
- Users
- Campaigns
- Calls
- Integrations
- Analytics
- Company settings


## Team Members

Team members can access features based on assigned permissions.

---

# Frontend Architecture

```
                 AI Powered Conversational platform Frontend

                        |

                 React Application

                        |

        --------------------------------

        Components
        Pages
        Hooks
        Services
        Store
        Utils
        Routes

        --------------------------------

                        |

                  Backend APIs

                        |

                  AI Powered Conversational platform Backend
```

---

# Technology Stack

## Core

- React.js
- TypeScript
- JavaScript

## Styling

- Tailwind CSS
- CSS Modules

## State Management

- Redux Toolkit
- Zustand

## API Communication

- Axios
- REST APIs

## Forms

- React Hook Form
- Yup / Zod Validation

## Routing

- React Router

## Real-Time Communication

- WebSocket

## Build Tools

- Vite

---

# Project Structure

```
src
│
├── assets
│
├── components
│   ├── common
│   ├── forms
│   ├── tables
│   └── layouts
│
├── pages
│   ├── Dashboard
│   ├── Agents
│   ├── Calls
│   ├── Campaigns
│   ├── Conversations
│   └── Settings
│
├── services
│   ├── api.ts
│   ├── auth.service.ts
│   ├── agent.service.ts
│   ├── call.service.ts
│   └── campaign.service.ts
│
├── hooks
│
├── store
│
├── routes
│
├── utils
│
├── types
│
└── App.tsx
```

---

# Environment Setup

Create a `.env` file in the project root.

Example:

```env
# Application

VITE_APP_NAME=AI Powered Conversational platform

VITE_APP_URL=http://localhost:5173


# Backend API

VITE_API_URL=http://localhost:3000


# WebSocket

VITE_SOCKET_URL=http://localhost:3000


# Authentication

VITE_TOKEN_KEY=hexa_token
```

---

# Installation

Clone repository:

```bash
git clone <repository-url>
```

Navigate to frontend:

```bash
cd hexa-ai-frontend
```

Install dependencies:

```bash
npm install
```

---

# Running Application

## Development Mode

```bash
npm run dev
```

Application will run on:

```
http://localhost:5173
```

---

## Production Build

Create production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

# API Integration

Frontend communicates with backend services.

Main modules:

```
Authentication
        |
Users
        |
Companies
        |
AI Agents
        |
Conversation Flows
        |
Calls
        |
Campaigns
        |
Analytics
        |
Integrations
```

---

# WebSocket Integration

WebSockets provide real-time updates.

Used for:

- Live call updates
- Call status changes
- Queue monitoring
- Conversation updates
- Real-time analytics

Architecture:

```
Backend

   |

WebSocket Connection

   |

AI Powered Conversational platform Dashboard

   |

Live UI Updates
```

---

# Application Routes

Example:

```
/

├── login

├── register

├── dashboard

├── agents

│    ├── list

│    ├── create

│    └── details


├── calls

│    ├── history

│    └── details


├── campaigns


├── conversations


├── integrations


└── settings
```

---

# UI Modules

## Dashboard

Provides:

- Usage statistics
- Call overview
- Agent performance
- Recent activities


## Agents

Manage:

- AI assistants
- Prompts
- Voices
- Flows
- Scripts


## Calls

Manage:

- Call history
- Call details
- Transcripts


## Campaigns

Manage:

- Campaign creation
- Contact lists
- Campaign progress


## Conversations

Review:

- Customer interactions
- AI responses
- Conversation history


## Settings

Manage:

- User profile
- Company details
- Team members
- Permissions

---

# Error Handling

The frontend handles:

- API failures
- Authentication errors
- Validation errors
- Network issues
- Permission errors
- Session expiration

Example:

```
API Request

      |

Success

      |

Update UI


Failure

      |

Display Error

      |

Log Issue
```

---

# Security

Frontend security practices:

- JWT authentication
- Protected routes
- Role-based permissions
- Secure API communication
- Environment variable protection
- Input validation
- HTTPS communication

---

# Deployment

Supported deployment platforms:

- Vercel
- Netlify
- AWS S3 + CloudFront
- Google Cloud Storage
- Docker + Nginx

Production checklist:

- Configure environment variables
- Configure API URL
- Configure WebSocket URL
- Enable HTTPS
- Configure CORS
- Verify production build

---

# Development Commands

## Start Development Server

```bash
npm run dev
```

## Build Application

```bash
npm run build
```

## Lint Code

```bash
npm run lint
```

## Format Code

```bash
npm run format
```

---

# Future Enhancements

Planned improvements:

- Advanced analytics dashboard
- AI agent marketplace
- More communication channels
- Advanced workflow builder
- Enterprise organization management
- Multi-language support
- Real-time monitoring improvements

---

# License

```
UNLICENSED

Copyright © AI Powered Conversational platform. All rights reserved.
```