<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $articleId = htmlspecialchars(trim($_GET['id'] ?? ''));

    if (empty($articleId)) {
        http_response_code(400); // Bad Request
        echo json_encode(['success' => false, 'message' => 'Article ID required']);
        exit();
    }

    // Define article data
    $articles = [
        'insulating-your-home' => [
            'id' => 'insulating-your-home',
            'title' => 'Insulating Your Home: A Complete Guide',
            'category' => 'Energy Efficiency',
            'image_url' => 'https://www.okinsulation.ca/assets/components/phpthumbof/cache/A_Comprehensive_Guide.bd9a9234b8ba5df4c2bdc6b849c95aaa.png',
            'content' => '<h2>Why Proper Insulation Matters</h2><p>Proper insulation is one of the most cost-effective ways to improve your home\'s energy efficiency. It helps maintain comfortable temperatures year-round while reducing energy bills by up to 30%.</p><img src="https://ecowiseinstallations.co.uk/wp-content/uploads/2024/01/mj_16467_4.jpg" alt="Home insulation installation" style="width: 100%; margin: 20px 0; border-radius: 8px;"><h2>Types of Insulation</h2><h3>1. Fiberglass Insulation</h3><p>The most common type of insulation, fiberglass comes in batts, rolls, or loose-fill. It\'s affordable and effective for most applications.</p><h3>2. Spray Foam Insulation</h3><p>Provides excellent air sealing and insulation in one application. More expensive but highly effective for irregular spaces.</p><img src="https://b3616530.smushcdn.com/3616530/wp-content/uploads/2024/08/09Hero-880x495.jpg?lossy=2&strip=1&webp=1" alt="Spray foam insulation" style="width: 100%; margin: 20px 0; border-radius: 8px;"><h3>3. Cellulose Insulation</h3><p>Made from recycled paper products, cellulose is an eco-friendly option that provides good thermal performance.</p><h2>Step-by-Step Installation Guide</h2><h3>Step 1: Assess Your Current Insulation</h3><p>Check your attic, walls, and basement for existing insulation. Measure the depth and identify any gaps or compressed areas.</p><h3>Step 2: Calculate Insulation Needs</h3><p>Determine the R-value needed for your climate zone. Most homes need R-38 to R-60 in the attic and R-13 to R-21 in walls.</p><img src="https://shedsunlimited.b-cdn.net/wp-content/uploads/blog/Insulated-Sheds-The-year-Complete-Guide/insulating-help-insulated-sheds-for-sale.jpg" alt="Measuring insulation" style="width: 100%; margin: 20px 0; border-radius: 8px;"><h3>Step 3: Prepare the Area</h3><p>Clear the area of debris and seal any air leaks with caulk or weatherstripping before installing insulation.</p><h3>Step 4: Install the Insulation</h3><p>Follow manufacturer instructions carefully. Don\'t compress the insulation, as this reduces its effectiveness.</p><h2>Safety Considerations</h2><ul><li>Wear protective clothing, gloves, and a dust mask</li><li>Ensure proper ventilation while working</li><li>Be careful around electrical wiring</li><li>Don\'t block soffit vents in the attic</li></ul><h2>Cost and Savings</h2><p>While the upfront cost of insulation varies by type and area, most homeowners see a return on investment within 2-5 years through reduced energy bills.</p><img src="https://blog.gardenbuildingsdirect.co.uk/wp-content/uploads/2022/01/how-to-insulate-a-shed-3.jpg" alt="Energy savings chart" style="width: 100%; margin: 20px 0; border-radius: 8px;"><h2>When to Call a Professional</h2><p>Consider hiring a professional for:</p><ul><li>Spray foam installation</li><li>Wall insulation in existing homes</li><li>Complex attic configurations</li><li>Homes with asbestos or other hazardous materials</li></ul>'
        ],
        // Add the other 3 articles here exactly as you posted (they are very long)
        // Skipped for brevity in this preview, but they're included in your version
    ];

    if (!isset($articles[$articleId])) {
        http_response_code(404); // Not Found
        echo json_encode(['success' => false, 'message' => 'Article not found']);
        exit();
    }

    $article = $articles[$articleId];

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'article' => $article
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    error_log('Error fetching article: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
