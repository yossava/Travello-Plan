const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkLogs() {
  try {
    // Get the most recent logs
    const logs = await prisma.openAILog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    console.log(`\n=== Found ${logs.length} logs ===\n`);

    for (const log of logs) {
      console.log(`\n--- Log ID: ${log.id} ---`);
      console.log(`Status: ${log.status}`);
      console.log(`Created: ${log.createdAt}`);
      console.log(`Model: ${log.model}`);
      console.log(`Duration: ${log.durationMs}ms`);
      console.log(`Tokens: ${log.totalTokens}`);
      console.log(`Was Repaired: ${log.wasRepaired}`);

      if (log.errorMessage) {
        console.log(`\nError Message: ${log.errorMessage}`);
      }

      if (log.parseError) {
        console.log(`\nParse Error: ${log.parseError}`);
      }

      if (log.response) {
        console.log(`\nResponse Length: ${log.response.length} characters`);
        console.log(`\nResponse Preview (first 500 chars):`);
        console.log(log.response.substring(0, 500));
        console.log(`\n... [content in middle] ...`);

        console.log(`\nResponse End (last 1000 chars):`);
        console.log(log.response.substring(Math.max(0, log.response.length - 1000)));
      }

      console.log('\n' + '='.repeat(80));
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkLogs();
