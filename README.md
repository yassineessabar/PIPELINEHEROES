# 🎮 PIPELINE HEROES

**Turn your sales KPIs into an epic RPG adventure!**

Pipeline Heroes is a revolutionary sales gamification platform that transforms your sales activities into an immersive RPG experience. Level up, complete quests, battle objection bosses, and compete with your team while improving your sales skills.

![Game Preview](https://via.placeholder.com/800x400?text=Pipeline+Heroes+Game+Map)

## ⚡ Features

- **🗺️ Interactive Game Map**: Navigate between 6 unique zones
- **📈 XP & Level System**: Gain experience from every sales activity
- **🎯 Quest System**: Daily, weekly, and milestone challenges
- **🏆 Achievement Engine**: Unlock badges and rewards
- **⚔️ Training Grounds**: Battle objection bosses and improve skills
- **🏪 Reward Shop**: Spend coins on perks and upgrades
- **👥 Team Leaderboards**: Compete with your sales team
- **🧠 AI Call Analysis**: Get detailed feedback on your calls
- **📊 Performance Tracking**: Monitor progress and improvements

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React, TailwindCSS, Shadcn/UI, Framer Motion
- **Backend**: Next.js Server Actions, Prisma ORM
- **Database**: PostgreSQL (or Supabase)
- **Authentication**: Supabase Auth
- **AI Integration**: OpenAI/Anthropic APIs

### Game Systems
- **XP Engine**: Dynamic experience calculation with multipliers
- **Quest Engine**: Automated progress tracking and completion
- **Achievement Engine**: Real-time achievement checking
- **Training Engine**: Objection handling simulation
- **Leaderboard Engine**: Team competition mechanics
- **Analysis Engine**: AI-powered call feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Supabase account)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yassineessabar/PIPELINEHEROES.git
   cd PIPELINEHEROES
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your database and API credentials:
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/pipeline_heroes"
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push database schema
   npm run db:push

   # Seed with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the game**
   Navigate to `http://localhost:3000` and start your sales adventure!

## 🎮 Game Zones

### 🏘️ Town Center
- View AI-powered call analysis
- Get personalized feedback and suggestions
- Track your performance metrics

### ⚔️ Training Grounds
- Battle objection handling bosses
- Practice sales scenarios
- Earn XP through skill challenges

### 🏪 Trading Post
- Spend coins on upgrades and perks
- Unlock cosmetic rewards
- Purchase XP boosters

### 📋 Quest Board
- View active daily/weekly missions
- Track quest progress
- Complete challenges for rewards

### 🏟️ Arena
- Team leaderboards
- Competitive rankings
- Performance comparisons

### 🏆 Vault
- Achievement gallery
- Unlock history
- Progress tracking

## 📊 Game Mechanics

### Experience Points (XP)
- **Call Completed**: 50 XP
- **Meeting Booked**: 100 XP
- **Demo Completed**: 150 XP
- **Deal Closed**: 500 XP
- **Training Completed**: 75 XP

### Level Progression
- Level 1: 0 XP
- Level 2: 1,000 XP
- Level 3: 3,000 XP
- Level 4: 6,000 XP
- Level 5: 10,000 XP
- *Exponential scaling continues...*

### Coins System
- Earned at 10% of XP gained
- Level-up bonuses
- Spend in Trading Post

## 🛠️ Development

### Database Commands
```bash
# View database in browser
npm run db:studio

# Reset database
npm run db:push --force-reset

# Re-seed database
npm run db:seed
```

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Project Structure
```
pipeline-heroes/
├── app/                 # Next.js App Router
│   ├── game/           # Game pages
│   └── api/            # API routes
├── components/         # React components
│   ├── game/          # Game-specific components
│   └── ui/            # Reusable UI components
├── lib/               # Utilities and engines
│   ├── game/         # Game logic engines
│   └── db/           # Database utilities
├── prisma/           # Database schema and seeds
└── public/           # Static assets
```

## 🔧 Configuration

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `OPENAI_API_KEY` | OpenAI API key (optional) |
| `ANTHROPIC_API_KEY` | Anthropic API key (optional) |

### Game Configuration

Customize game mechanics in:
- `lib/utils.ts` - XP calculation formulas
- `lib/game/xpEngine.ts` - XP rewards and multipliers
- `prisma/seed.ts` - Default quests and achievements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced AI call coaching
- [ ] Team challenges and tournaments
- [ ] Integration with CRM systems
- [ ] Voice call recording analysis
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

## 🆘 Support

- 📖 Documentation: [Wiki](https://github.com/yassineessabar/PIPELINEHEROES/wiki)
- 🐛 Issues: [GitHub Issues](https://github.com/yassineessabar/PIPELINEHEROES/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yassineessabar/PIPELINEHEROES/discussions)

---

**Ready to become a Pipeline Hero? Let the games begin! 🎮⚔️**
