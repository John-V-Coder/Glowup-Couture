const EmailTemplate = require('../models/EmailTemplate');
const { defaultTemplates } = require('./emailTemplates');

const seedEmailTemplates = async () => {
  try {
    console.log('Seeding email templates...');
    
    for (const template of defaultTemplates) {
      await EmailTemplate.findOneAndUpdate(
        { name: template.name },
        template,
        { upsert: true, new: true }
      );
      console.log(`Template '${template.name}' seeded successfully`);
    }
    
    console.log('All email templates seeded successfully!');
  } catch (error) {
    console.error('Error seeding email templates:', error);
  }
};

module.exports = { seedEmailTemplates };