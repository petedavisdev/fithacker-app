/**
 * Browser console script to load EXERCISE_LOG.json for migration testing
 * 
 * Copy and paste this entire script into the browser console at http://localhost:3001
 * Then refresh the page to trigger migration
 */

(async function() {
    try {
        // Clear existing migration state
        localStorage.removeItem('exerciseLogV2');
        localStorage.removeItem('exerciseLogMigrated');
        
        // Fetch the JSON file
        const response = await fetch('/data/EXERCISE_LOG.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data = await response.json();
        const dataString = JSON.stringify(data);
        
        // Store as old format
        localStorage.setItem('exerciseLog', dataString);
        
        console.log('✅ Test data loaded successfully!');
        console.log(`   Dates: ${Object.keys(data).length}`);
        console.log(`   Size: ${dataString.length} bytes`);
        console.log('   Sample date:', Object.keys(data)[0]);
        console.log('   Sample value:', data[Object.keys(data)[0]]);
        console.log('\n🔄 Now refresh the page to trigger migration...');
        
        return {
            success: true,
            dateCount: Object.keys(data).length,
            size: dataString.length
        };
    } catch (error) {
        console.error('❌ Failed to load test data:', error);
        throw error;
    }
})();

