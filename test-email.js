/**
 * Test script for welcome email functionality
 * Run with: node test-email.js
 */

async function testEmail() {
    const testData = {
        email: 'tester419tester@gmail.com',
        name: 'Test User'
    };

    console.log('🧪 Testing welcome email...');
    console.log(`📧 Sending to: ${testData.email}`);
    console.log(`👤 Name: ${testData.name}`);
    console.log('');

    try {
        // Test local API endpoint
        const response = await fetch('http://localhost:3000/api/send-welcome-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData),
        });

        const result = await response.json();

        if (response.ok) {
            console.log('✅ SUCCESS! Email sent.');
            console.log('📬 Result:', result);
            console.log('');
            console.log('Check your inbox: tester419tester@gmail.com');
        } else {
            console.error('❌ FAILED:', result.error);
        }
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.log('');
        console.log('💡 Make sure the dev server is running:');
        console.log('   vercel dev   (or)   npm run dev');
    }
}

testEmail();
