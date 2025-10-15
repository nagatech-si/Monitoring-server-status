import mongoose from 'mongoose';
import Group from '../models/Group.js';
import '../config/database.js';

const seedGroups = async () => {
  try {
    console.log('🌱 Seeding initial groups...');
    
    const groups = [
      {
        name: 'NAGAGOLD',
        description: 'Server group untuk NAGAGOLD'
      },
      {
        name: 'PANTES',
        description: 'Server group untuk PANTES'
      },
      {
        name: 'SURYAJAYA',
        description: 'Server group untuk SURYAJAYA'
      }
    ];

    for (const groupData of groups) {
      const existingGroup = await Group.findOne({ name: groupData.name });
      if (!existingGroup) {
        const group = await Group.create(groupData);
        console.log(`✅ Created group: ${group.name} (ID: ${group._id})`);
      } else {
        console.log(`⚠️  Group already exists: ${groupData.name}`);
      }
    }

    console.log('🎉 Seeding completed!');
    
  } catch (error) {
    console.error('Error seeding groups:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
seedGroups();