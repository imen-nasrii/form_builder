# FormBuilder Pro

Advanced multi-platform enterprise AI form generation platform that leverages artificial intelligence to streamline form creation and deployment across diverse technological ecosystems.

## 🏗️ Architecture

```
FormBuilder Pro/
├── backend/     # Node.js + Express + PostgreSQL
├── frontend/    # React + Blazor Server
└── ia/         # Python Streamlit + AI Assistant
```



### Installation
```bash
git clone https://github.com/your-username/formbuilder-pro.git
cd formbuilder-pro
npm install
```

### Environment Setup
Create `.env` in backend/ folder:
```bash
DATABASE_URL=postgresql://user:password@host:5432/database
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
NODE_ENV=development
PORT=5000
SESSION_SECRET=your-session-secret
```

### Run Application
```bash
npm run dev
```
Access: http://localhost:5000



- `backend/server/` - Express API server
- `backend/shared/` - Shared schemas and types
- `frontend/react/` - React application
- `frontend/blazor/` - .NET Blazor alternative
- `ia/streamlit/` - AI assistant interface
- `ia/models/` - MFact business models

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev
```

### Blazor Development
```bash
cd frontend/blazor
dotnet watch run --urls="https://localhost:7000"
```

### AI Assistant
```bash
cd ia
source formbuilder_ai_env/bin/activate
streamlit run streamlit/ai_assistant.py --server.port=8501
```

## 📊 Database Schema

- Users with authentication
- Forms with components
- Notifications system
- Admin management

## 🤖 AI Integration

- Claude API for intelligent assistance
- DFM file parsing to JSON
- Real-time form suggestions
- Business model integration

## 🚢 Deployment

Ready for deployment on:
- Replit
- Vercel
- Railway
- Any Node.js hosting

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

For issues and questions, please open a GitHub issue.
