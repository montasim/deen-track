import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TEMPLATE_ID = '627156bb-ab26-44e5-9203-65712d418e06'

// User ID who will be the creator
const CREATOR_USER_ID = 'feab0de4-f774-449e-bec8-0c049e9bed0f'

// Ramadan Campaign Data
const ramadanCampaignData = {
  name: 'রমজান চ্যালেঞ্জ ২০২৫ - আধ্যাত্মিক যাত্রা',
  description: 'এই রমজানে আপনার ঈমানকে শক্তিশালী করুন! রোজা, নামাজ, কুরআন তিলাওয়াত, তারাবিহ, সদকাহ এবং যিকিরের মাধ্যমে আল্লাহর সন্তুষ্টি অর্জন করুন। প্রতিটি ভালো কাজের জন্য পয়েন্ট পান এবং আকর্ষণীয় পুরস্কার জিতে নিন! 🌙✨',
  startDate: new Date('2025-03-01T00:00:00Z'),
  endDate: new Date('2025-04-01T23:59:59Z'),
  maxParticipants: 10000,
  rewards: [
    {
      rank: '1',
      type: 'GRAND_PRIZE',
      description: '🏆 গ্র্যান্ড পুরস্কার - স্মার্টওয়াচ বা সমমানের ইলেকট্রনিক্স',
      value: '৳১৫,০০০'
    },
    {
      rank: '2-3',
      type: 'RUNNER_UP',
      description: '🥈 রানার আপ - ব্লুটুথ ইয়ারবাড বা সমমানের পুরস্কার',
      value: '৳৮,০০০'
    },
    {
      rank: '4-10',
      type: 'TOP_TEN',
      description: '🥉 টপ ১০ - ইসলামিক বুক বান্ডেল',
      value: '৳৩,০০০'
    },
    {
      rank: '11-50',
      type: 'TOP_FIFTY',
      description: '🎖️ টপ ৫০ - বিশেষ ব্যাজ ও সার্টিফিকেট',
      value: 'ডিজিটাল রিওয়ার্ড'
    },
    {
      rank: '50+',
      type: 'PARTICIPATION',
      description: '⭐ সব অংশগ্রহণকারী - অংশগ্রহণ সার্টিফিকেট',
      value: 'ডিজিটাল সার্টিফিকেট'
    }
  ],
  rules: `### 📜 সাধারণ নিয়মাবলি:

১. **সততা**: সব কাজ সত্যিই করতে হবে এবং সঠিক প্রমাণ জমা দিতে হবে।
২. **প্রমাণ জমা**: প্রতিটি কাজের প্রমাণ জমা দিতে হবে (ছবি, অডিও, বা লিখিত)।
৩. **সময়সীমা**: প্রতিটি কাজ নির্দিষ্ট সময়ের মধ্যে জমা দিতে হবে।
৪. **বয়স**: ১০-৪০ বছর বয়সী যে কেউ অংশ নিতে পারে।
৫. **ভাষা**: বাংলা বা ইংরেজিতে প্রমাণ জমা দিতে পারেন।

### ⚠️ অযোগ্যতার কারণ:

- মিথ্যা বা জাল প্রমাণ জমা দিলে
- অন্যের কাজ বা প্রমাণ কপি করলে
- অশালীন ভাষা বা আচরণ করলে
- ইচ্ছাকৃতভাবে নিয়ম ভঙ্গ করলে

### 🎁 পয়েন্ট ব্যবস্থা:

- প্রতিটি কাজ আলাদা পয়েন্ট আছে
- বোনাস পয়েন্ট পাওয়ার সুযোগ আছে
- ১০০+ পয়েন্ট পেলে পুরস্কারের যোগ্য`,
  disqualificationRules: '**সতর্কতা:** কোনো প্রতারণা বা মিথ্যা তথ্য প্রমাণিত হলে আপনি সাথে সাথে অযোগ্য ঘোষিত হবেন এবং আপনার সব পয়েন্ট বাতিল হবে। আপনার অ্যাকাউন্ট সাময়িক বা স্থায়ীভাবে স্থগিত হতে পারে।'
}

async function createRamadanCampaign() {
  try {
    console.log('🔄 Creating Ramadan campaign from template...\n')

    // Step 1: Check if template exists
    console.log('📋 Fetching template...')
    const template = await prisma.campaignTemplate.findUnique({
      where: { id: TEMPLATE_ID },
      include: {
        templateTasks: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!template) {
      throw new Error(`Template with ID ${TEMPLATE_ID} not found`)
    }

    console.log(`✅ Found template: "${template.name}"`)
    console.log(`   - ${template.templateTasks.length} tasks`)
    console.log(`   - Difficulty: ${template.difficulty}\n`)

    // Step 2: Create campaign tasks from template
    console.log('➕ Creating campaign tasks...')
    const createdTasks = await Promise.all(
      template.templateTasks.map((tt) =>
        prisma.campaignTask.create({
          data: {
            name: tt.name,
            description: tt.description,
            rules: tt.rules,
            disqualificationRules: tt.disqualificationRules,
            startDate: ramadanCampaignData.startDate,
            endDate: ramadanCampaignData.endDate,
            validationType: 'MANUAL',
            isActive: true,
            entryById: CREATOR_USER_ID,
            // Create achievements for this task
            achievements: {
              create: (tt.achievementsTemplate as any[] || []).map((ach) => ({
                name: ach.name,
                description: ach.description,
                points: ach.points,
                icon: ach.icon || null,
                howToAchieve: `Complete ${tt.name} to earn this achievement.`,
                order: 0,
              })),
            },
          },
        })
      )
    )

    console.log(`✅ Created ${createdTasks.length} tasks\n`)

    // Step 3: Create the gamified campaign
    console.log('🎯 Creating gamified campaign...')
    const campaign = await prisma.gamifiedCampaign.create({
      data: {
        name: ramadanCampaignData.name,
        description: ramadanCampaignData.description,
        rules: ramadanCampaignData.rules,
        disqualificationRules: ramadanCampaignData.disqualificationRules,
        startDate: ramadanCampaignData.startDate,
        endDate: ramadanCampaignData.endDate,
        maxParticipants: ramadanCampaignData.maxParticipants,
        isActive: true,
        rewards: ramadanCampaignData.rewards as any,
        entryById: CREATOR_USER_ID,
        // Link tasks to campaign
        tasks: {
          create: createdTasks.map((task, index) => ({
            taskId: task.id,
            order: index,
          })),
        },
      },
      include: {
        tasks: {
          include: {
            task: {
              include: {
                achievements: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    console.log(`✅ Campaign created: "${campaign.name}"`)
    console.log(`   - Campaign ID: ${campaign.id}`)
    console.log(`   - Start Date: ${campaign.startDate.toLocaleDateString('bn-BD')}`)
    console.log(`   - End Date: ${campaign.endDate.toLocaleDateString('bn-BD')}`)
    console.log(`   - Max Participants: ${campaign.maxParticipants}`)
    console.log(`   - Active: ${campaign.isActive ? 'Yes' : 'No'}\n`)

    // Step 4: Display campaign details
    console.log('📋 Campaign Tasks:')
    campaign.tasks.forEach((ct, index) => {
      const task = ct.task
      const templateTask = template.templateTasks[index]
      const achievementsCount = task.achievements.length
      console.log(`   ${index + 1}. ${task.name}`)
      console.log(`      - Points: ${templateTask.points}`)
      console.log(`      - Achievements: ${achievementsCount}`)
    })

    console.log('\n🎁 Rewards:')
    ramadanCampaignData.rewards.forEach((reward) => {
      console.log(`   ${reward.rank}: ${reward.description}`)
    })

    console.log('\n✨ Campaign successfully created!')
    console.log(`\n🔗 Campaign URL: /campaigns/${campaign.id}`)
    console.log(`📊 Admin URL: /dashboard/admin/campaigns/${campaign.id}`)
  } catch (error) {
    console.error('\n❌ Error creating campaign:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
createRamadanCampaign()
  .then(() => {
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })
