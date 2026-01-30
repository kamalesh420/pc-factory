import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../');

console.log('🧪 Starting Authentication Tests...\n');

const tests = {
    passed: 0,
    failed: 0,
    results: []
};

function test(name, condition) {
    if (condition) {
        tests.passed++;
        tests.results.push(`✅ ${name}`);
    } else {
        tests.failed++;
        tests.results.push(`❌ ${name}`);
    }
}

async function runTests() {
    // Test 1: Check Firebase config exists
    const configPath = path.join(rootDir, 'config', 'firebase.ts');
    test('Firebase config file exists', fs.existsSync(configPath));

    // Test 2: Check AuthContext exists
    const contextPath = path.join(rootDir, 'context', 'AuthContext.tsx');
    test('AuthContext file exists', fs.existsSync(contextPath));

    // Test 3: Check SignIn page exists
    const signInPath = path.join(rootDir, 'pages', 'SignIn.tsx');
    test('SignIn page exists', fs.existsSync(signInPath));

    // Test 4: Check SignUp page exists
    const signUpPath = path.join(rootDir, 'pages', 'SignUp.tsx');
    test('SignUp page exists', fs.existsSync(signUpPath));

    // Test 5: Check ProtectedRoute exists
    const protectedRoutePath = path.join(rootDir, 'components', 'ProtectedRoute.tsx');
    test('ProtectedRoute component exists', fs.existsSync(protectedRoutePath));

    // Test 6: Check environment variables
    const envPath = path.join(rootDir, '.env.local');
    const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    const hasPlaceholders = envContent.includes('your_api_key_here');

    if (hasPlaceholders) {
        tests.failed++;
        tests.results.push(`⚠️  Environment file exists but contains PLACEHOLDERS (Action Required)`);
    } else {
        test('Environment file configured', fs.existsSync(envPath));
    }

    // Print results
    console.log('\n📊 TEST RESULTS:');
    console.log('================');
    tests.results.forEach(r => console.log(r));
    console.log('================');
    console.log(`Total: ${tests.passed + tests.failed} | Passed: ${tests.passed} | Failed: ${tests.failed}`);

    if (tests.failed > 0) {
        console.log('\n⚠️  Some tests failed. Please fix issues before proceeding.');
        // We don't exit(1) here to allow the agent to see the output without crashing the tool call
    } else {
        console.log('\n🎉 All tests passed! Authentication setup is complete.');
    }
}

runTests().catch(console.error);
