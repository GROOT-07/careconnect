import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  const hash = (p: string) => bcrypt.hashSync(p, 10)

  // Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@careconnect.com' },
    update: {},
    create: { email: 'admin@careconnect.com', name: 'Admin User', passwordHash: hash('admin123'), role: 'ADMIN', avatarInitial: 'A' }
  })

  const mariaUser = await prisma.user.upsert({
    where: { email: 'maria@careconnect.com' },
    update: {},
    create: { email: 'maria@careconnect.com', name: 'Maria Chen', passwordHash: hash('caregiver123'), role: 'CAREGIVER', avatarInitial: 'M' }
  })

  const jamesUser = await prisma.user.upsert({
    where: { email: 'james@careconnect.com' },
    update: {},
    create: { email: 'james@careconnect.com', name: 'James Osei', passwordHash: hash('caregiver123'), role: 'CAREGIVER', avatarInitial: 'J' }
  })

  const sarah = await prisma.user.upsert({
    where: { email: 'sarah@family.com' },
    update: {},
    create: { email: 'sarah@family.com', name: 'Sarah Reynolds', passwordHash: hash('family123'), role: 'FAMILY', avatarInitial: 'S' }
  })

  const eleanorUser = await prisma.user.upsert({
    where: { email: 'eleanor@patient.com' },
    update: {},
    create: { email: 'eleanor@patient.com', name: 'Eleanor Reynolds', passwordHash: hash('patient123'), role: 'PATIENT', avatarInitial: 'E' }
  })

  // Caregiver profiles
  const maria = await prisma.caregiver.upsert({
    where: { userId: mariaUser.id },
    update: {},
    create: { userId: mariaUser.id, specialties: 'Dementia, Elderly Care', rating: 4.9, isOnDuty: true }
  })

  const james = await prisma.caregiver.upsert({
    where: { userId: jamesUser.id },
    update: {},
    create: { userId: jamesUser.id, specialties: 'Mobility Support, Companionship', rating: 4.7, isOnDuty: true }
  })

  // Clients
  const eleanor = await prisma.client.upsert({
    where: { id: 'client-eleanor' },
    update: {},
    create: {
      id: 'client-eleanor',
      name: 'Eleanor Reynolds', age: 82,
      conditions: 'Dementia, Hypertension',
      dietaryNotes: 'Low-sodium diet. Prefers warm soup for lunch.',
      careNotes: 'Enjoys reminiscing about Maine. Responds well to music from the 1960s.',
      status: 'ACTIVE',
      familyContactId: sarah.id,
      patientUserId: eleanorUser.id,
      assignedCaregiverId: maria.id,
    }
  })

  const frank = await prisma.client.upsert({
    where: { id: 'client-frank' },
    update: {},
    create: {
      id: 'client-frank',
      name: 'Frank Donovan', age: 76,
      conditions: 'Mobility impairment',
      careNotes: 'Assist with bath. Favourite music: jazz.',
      status: 'PRIORITY',
      assignedCaregiverId: james.id,
    }
  })

  const margaret = await prisma.client.upsert({
    where: { id: 'client-margaret' },
    update: {},
    create: {
      id: 'client-margaret',
      name: 'Margaret Sullivan', age: 79,
      conditions: 'Diabetes, Heart disease',
      careNotes: 'Check blood sugar before leaving for appointments.',
      status: 'MONITORING',
      assignedCaregiverId: maria.id,
    }
  })

  // Medications
  await prisma.medication.createMany({
    data: [
      { clientId: eleanor.id, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', timeOfDay: '10:00' },
      { clientId: eleanor.id, name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', timeOfDay: '10:00' },
      { clientId: margaret.id, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', timeOfDay: '08:00,20:00' },
    ]
  })

  // Bookings
  const today = new Date()
  today.setHours(9, 0, 0, 0)
  await prisma.booking.createMany({
    data: [
      { clientId: eleanor.id, caregiverId: maria.id, serviceType: 'MORNING_CARE', scheduledAt: today, durationMins: 120, status: 'CONFIRMED' },
      { clientId: frank.id, caregiverId: james.id, serviceType: 'PERSONAL_CARE', scheduledAt: new Date(today.getTime() + 2.5 * 3600000), durationMins: 90, status: 'CONFIRMED' },
      { clientId: margaret.id, caregiverId: maria.id, serviceType: 'DOCTOR_ESCORT', scheduledAt: new Date(today.getTime() + 5 * 3600000), durationMins: 60, status: 'CONFIRMED' },
    ]
  })

  // Activity logs
  await prisma.activityLog.createMany({
    data: [
      { clientId: eleanor.id, caregiverId: maria.id, activityType: 'MEAL_PREPARED', title: 'Breakfast prepared & served', notes: 'Oatmeal with berries. Eleanor ate well.', completedAt: new Date(Date.now() - 2 * 3600000) },
      { clientId: eleanor.id, caregiverId: maria.id, activityType: 'GENERAL', title: 'Morning clean-up completed', notes: 'Kitchen and living room tidied.', completedAt: new Date(Date.now() - 3 * 3600000) },
      { clientId: frank.id, caregiverId: james.id, activityType: 'COMPANIONSHIP', title: 'Evening routine completed', notes: 'Watched jazz documentary together.', completedAt: new Date(Date.now() - 18 * 3600000) },
    ]
  })

  // Memories
  await prisma.memory.createMany({
    data: [
      { id: 'mem-1', clientId: eleanor.id, title: 'The Summer We Drove to Maine', year: 1968, category: 'travel', description: 'You and Robert packed the old blue Chevrolet and drove 14 hours to see the lighthouses. The lobster at that little shack in Bar Harbor was the best you had ever had.', color1: '#C4A882', color2: '#8A6840' },
      { id: 'mem-2', clientId: eleanor.id, title: "Sarah's First Steps", year: 1975, category: 'family', description: 'A Tuesday afternoon in the kitchen. Sarah pulled herself up against the refrigerator and let go — three wobbly steps to your arms. You cried.', color1: '#8BAF8D', color2: '#4A7A60' },
      { id: 'mem-3', clientId: eleanor.id, title: 'Our Wedding Day', year: 1962, category: 'milestone', description: "St. Catherine's Church on a rainy April Saturday. Robert's nervous smile at the altar, and the best dancing you've ever done at the Riverside Hall reception.", color1: '#7B9EC7', color2: '#4A6080' },
      { id: 'mem-4', clientId: eleanor.id, title: 'The Rose Garden', year: 1990, category: 'garden', description: 'You spent three summers building the rose garden on the south side of the house. Thirty-two varieties. The Mr. Lincoln deep reds were your favourite.', color1: '#C4724A', color2: '#8A4030' },
      { id: 'mem-5', clientId: eleanor.id, title: 'Christmas Morning 2005', year: 2005, category: 'holiday', description: 'The whole family for the last time in the big house — seven grandchildren, everyone in pyjamas. The dog knocked over the tree at 7am and everyone laughed.', color1: '#9B8EC4', color2: '#6B5EA0' },
    ]
  })

  // Mood
  await prisma.moodCheckin.create({
    data: { clientId: eleanor.id, mood: 'happy', emoji: '😊', notes: 'Had a lovely morning' }
  })

  // Messages
  await prisma.message.createMany({
    data: [
      { clientId: eleanor.id, senderId: mariaUser.id, senderName: 'Maria Chen', content: 'Hi Sarah! Eleanor had a lovely morning. She asked for soup for lunch — is that OK?', isOwn: false },
      { clientId: eleanor.id, senderId: sarah.id, senderName: 'Sarah Reynolds', content: 'That sounds perfect, thank you Maria! 🌿', isOwn: false },
      { clientId: eleanor.id, senderId: mariaUser.id, senderName: 'Maria Chen', content: 'Eleanor is in great spirits today. We did the photo album and she shared a beautiful story about her rose garden.', isOwn: false },
    ]
  })

  console.log('✅ Database seeded!')
  console.log('')
  console.log('Demo accounts:')
  console.log('  Admin:     admin@careconnect.com  / admin123')
  console.log('  Family:    sarah@family.com        / family123')
  console.log('  Caregiver: maria@careconnect.com   / caregiver123')
  console.log('  Patient:   eleanor@patient.com     / patient123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
