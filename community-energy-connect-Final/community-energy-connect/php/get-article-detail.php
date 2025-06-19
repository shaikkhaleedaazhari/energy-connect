<?php
header('Content-Type: application/json');

try {
    $articleId = $_GET['id'] ?? '';
    
    if (empty($articleId)) {
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
            'content' => '
                <h2>Why Proper Insulation Matters</h2>
                <p>Proper insulation is one of the most cost-effective ways to improve your home\'s energy efficiency. It helps maintain comfortable temperatures year-round while reducing energy bills by up to 30%.</p>
                
                <img src="https://ecowiseinstallations.co.uk/wp-content/uploads/2024/01/mj_16467_4.jpg" alt="Home insulation installation" style="width: 100%; margin: 20px 0; border-radius: 8px;">
                
                <h2>Types of Insulation</h2>
                <h3>1. Fiberglass Insulation</h3>
                <p>The most common type of insulation, fiberglass comes in batts, rolls, or loose-fill. It\'s affordable and effective for most applications.</p>
                
                <h3>2. Spray Foam Insulation</h3>
                <p>Provides excellent air sealing and insulation in one application. More expensive but highly effective for irregular spaces.</p>
                
                <img src="https://b3616530.smushcdn.com/3616530/wp-content/uploads/2024/08/09Hero-880x495.jpg?lossy=2&strip=1&webp=1" alt="Spray foam insulation" style="width: 100%; margin: 20px 0; border-radius: 8px;">
                
                <h3>3. Cellulose Insulation</h3>
                <p>Made from recycled paper products, cellulose is an eco-friendly option that provides good thermal performance.</p>
                
                <h2>Step-by-Step Installation Guide</h2>
                <h3>Step 1: Assess Your Current Insulation</h3>
                <p>Check your attic, walls, and basement for existing insulation. Measure the depth and identify any gaps or compressed areas.</p>
                
                <h3>Step 2: Calculate Insulation Needs</h3>
                <p>Determine the R-value needed for your climate zone. Most homes need R-38 to R-60 in the attic and R-13 to R-21 in walls.</p>
                
                <img src="https://shedsunlimited.b-cdn.net/wp-content/uploads/blog/Insulated-Sheds-The-year-Complete-Guide/insulating-help-insulated-sheds-for-sale.jpg" alt="Measuring insulation" style="width: 100%; margin: 20px 0; border-radius: 8px;">
                
                <h3>Step 3: Prepare the Area</h3>
                <p>Clear the area of debris and seal any air leaks with caulk or weatherstripping before installing insulation.</p>
                
                <h3>Step 4: Install the Insulation</h3>
                <p>Follow manufacturer instructions carefully. Don\'t compress the insulation, as this reduces its effectiveness.</p>
                
                <h2>Safety Considerations</h2>
                <ul>
                    <li>Wear protective clothing, gloves, and a dust mask</li>
                    <li>Ensure proper ventilation while working</li>
                    <li>Be careful around electrical wiring</li>
                    <li>Don\'t block soffit vents in the attic</li>
                </ul>
                
                <h2>Cost and Savings</h2>
                <p>While the upfront cost of insulation varies by type and area, most homeowners see a return on investment within 2-5 years through reduced energy bills.</p>
                
                <img src="https://blog.gardenbuildingsdirect.co.uk/wp-content/uploads/2022/01/how-to-insulate-a-shed-3.jpg" alt="Energy savings chart" style="width: 100%; margin: 20px 0; border-radius: 8px;">
                
                <h2>When to Call a Professional</h2>
                <p>Consider hiring a professional for:</p>
                <ul>
                    <li>Spray foam installation</li>
                    <li>Wall insulation in existing homes</li>
                    <li>Complex attic configurations</li>
                    <li>Homes with asbestos or other hazardous materials</li>
                </ul>
            '
        ],
        'switching-to-led-lighting' => [
            'id' => 'switching-to-led-lighting',
            'title' => 'Switching to LED Lighting: Benefits and Installation Guide',
            'category' => 'Energy Efficiency',
            'image_url' => 'https://images.articlesfactory.com/750x0/eec169f1-13b4-4d98-900a-2e8cbf05293b.webp',
            'content' => '
                <h2>Why Switch to LED Lighting?</h2>
                <p>LED lights use up to 80% less energy than traditional incandescent bulbs and last 25 times longer. This makes them an excellent investment for any home or business.</p>
                
                <img src="https://www.schaferelectric.com/wp-content/uploads/2021/01/benefits-of-upgrading-to-led-lighting.webp" alt="LED vs traditional bulbs comparison" style="width: 100%; margin: 20px 0; border-radius: 8px;">
                
                <h2>Benefits of LED Lighting</h2>
                <h3>Energy Efficiency</h3>
                <p>LEDs convert 95% of energy into light, compared to only 5% for incandescent bulbs. The rest becomes heat, which is wasted energy.</p>
                
                <h3>Long Lifespan</h3>
                <p>Quality LED bulbs can last 15,000 to 50,000 hours, compared to 1,000 hours for incandescent bulbs.</p>
                
                <h3>Environmental Benefits</h3>
                <p>LEDs contain no toxic materials and are 100% recyclable. They also reduce carbon emissions due to lower energy consumption.</p>
                
                <img src="https://www.meteorelectrical.com/media/.renditions/wysiwyg/Brightening_Your_Space.jpg" alt="Modern LED lighting installation" style="width: 100%; margin: 20px 0; border-radius: 8px;">
                
                <h2>Types of LED Lights</h2>
                <h3>Standard LED Bulbs</h3>
                <p>Direct replacements for incandescent and CFL bulbs. Available in various shapes and sizes.</p>
                
                <h3>Smart LED Bulbs</h3>
                <p>Can be controlled via smartphone apps, offering dimming, color changing, and scheduling features.</p>
                
                <h3>LED Strip Lights</h3>
                <p>Flexible strips perfect for accent lighting, under-cabinet lighting, and decorative applications.</p>
                
                <h2>Installation Guide</h2>
                <h3>Step 1: Choose the Right LEDs</h3>
                <p>Match the wattage equivalent and color temperature to your existing bulbs. Look for ENERGY STAR certified products.</p>
                
                <h3>Step 2: Turn Off Power</h3>
                <p>Always turn off the power at the switch before replacing any light bulb for safety.</p>
                
                <img src="https://e-greenelectrical.com.au/wp-content/uploads/2022/01/What-are-led-lights.jpg" alt="LED bulb installation" style="width: 100%; margin: 20px 0; border-radius: 8px;">
                
                <h3>Step 3: Remove Old Bulbs</h3>
                <p>Carefully unscrew old bulbs and dispose of them properly. CFLs should be recycled at appropriate facilities.</p>
                
                <h3>Step 4: Install LED Bulbs</h3>
                <p>Screw in the new LED bulbs. They should fit the same sockets as your old bulbs.</p>
                
                <h2>Cost Analysis</h2>
                <p>While LEDs cost more upfront, they save money over time:</p>
                <ul>
                    <li>LED bulb: $8-15 each</li>
                    <li>Energy savings: $50-100 per bulb over lifetime</li>
                    <li>Replacement savings: No need to buy bulbs for 10-20 years</li>
                </ul>
                
                <h2>Common Issues and Solutions</h2>
                <h3>Flickering</h3>
                <p>Usually caused by incompatible dimmer switches. Replace with LED-compatible dimmers.</p>
                
                <h3>Color Temperature</h3>
                <p>Choose warm white (2700K-3000K) for living areas and cool white (4000K-5000K) for task lighting.</p>
                
                <img src="https://www.meteorelectrical.com/media/.renditions/wysiwyg/Versatility_and_Variety.jpg" alt="LED color temperature guide" style="width: 100%; margin: 20px 0; border-radius: 8px;">
            '
        ],
        'understanding-solar-panels' => [
            'id' => 'understanding-solar-panels',
            'title' => 'Understanding Solar Panels: Technology and Applications',
            'category' => 'Solar Energy',
            'image_url' => 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80',
            'content' => '
                <h2>How Solar Panels Work</h2>
                <p>Solar panels convert sunlight into electricity through photovoltaic cells. When sunlight hits these cells, it creates an electric field that generates direct current (DC) electricity.</p>
                
                <img src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80" alt="Solar panel installation on roof" style="width: 100%; margin: 20px 0; border-radius: 8px;">
                
                <h2>Types of Solar Panels</h2>
                <h3>Monocrystalline Solar Panels</h3>
                <p>Made from single-crystal silicon, these panels offer the highest efficiency (15-22%) and longest lifespan but cost more.</p>
                
                <h3>Polycrystalline Solar Panels</h3>
                <p>Made from multiple silicon crystals, these panels are less expensive but slightly less efficient (13-16%).</p>
                
                <h3>Thin-Film Solar Panels</h3>
                <p>Lightweight and flexible, these panels work well in low-light conditions but have lower efficiency (10-12%).</p>
                
                <img src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80" alt="Different types of solar panels" style="width: 100%; margin: 20px 0; border-radius: 8px;">
                
                <h2>Solar Panel Components</h2>
                <h3>Photovoltaic Cells</h3>
                <p>The heart of the solar panel, these cells convert sunlight into electricity through the photovoltaic effect.</p>
                
                <h3>Inverter</h3>
                <p>Converts DC electricity from panels into AC electricity used by home appliances.</p>
                
                <h3>Mounting System</h3>
                <p>Secures panels to your roof or ground-mount structure while allowing for proper ventilation.</p>
                
                <h2>Factors Affecting Solar Panel Performance</h2>
                <h3>Sunlight Exposure</h3>
                <p>Panels perform best with direct sunlight. Shading from trees or buildings can significantly reduce output.</p>
                
                <h3>Temperature</h3>
                <p>While panels need sunlight, they actually work more efficiently in cooler temperatures.</p>
                
                <img src="https://www.maysunsolar.com/wp-content/uploads/2023/05/%E5%9B%BE2-2-1024x576.jpg" alt="Solar panel performance factors" style="width: 100%; margin: 20px 0; border-radius: 8px;">
                
                <h3>Orientation and Tilt</h3>
                <p>In the Northern Hemisphere, panels should face south with a tilt angle equal to your latitude for optimal performance.</p>
                
                <h2>Installation Considerations</h2>
                <h3>Roof Assessment</h3>
                <p>Your roof should be in good condition and able to support the weight of solar panels (2-4 pounds per square foot).</p>
                
                <h3>Electrical System</h3>
                <p>Your electrical panel may need upgrades to handle the solar system safely.</p>
                
                <h3>Permits and Inspections</h3>
                <p>Most installations require building permits and electrical inspections for safety and code compliance.</p>
                
                <h2>Financial Benefits</h2>
                <h3>Federal Tax Credits</h3>
                <p>The federal solar Investment Tax Credit (ITC) allows you to deduct 30% of solar installation costs from federal taxes.</p>
                
                <h3>Net Metering</h3>
                <p>Many utilities offer net metering, allowing you to sell excess electricity back to the grid.</p>
                
                <img src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80" alt="Solar energy savings" style="width: 100%; margin: 20px 0; border-radius: 8px;">
                
                <h2>Maintenance and Lifespan</h2>
                <p>Solar panels require minimal maintenance:</p>
                <ul>
                    <li>Regular cleaning to remove dirt and debris</li>
                    <li>Annual inspection of mounting hardware</li>
                    <li>Monitoring system performance</li>
                    <li>Professional maintenance every 5-10 years</li>
                </ul>
                
                <p>Most solar panels come with 20-25 year warranties and can last 30+ years with proper care.</p>
            '
        ],
        'water-conservation-tips' => [
            'id' => 'water-conservation-tips',
            'title' => 'Water Conservation Tips: Save Money and the Environment',
            'category' => 'Conservation',
            'image_url' => 'https://delf2iyv2crlj.cloudfront.net/Images/Water%20Conservation%20in%20Residential%20Properties-%20Tips%20and%20Strategies%20for%20Sustainable%20Water%20Usage81070187-02a6-4dd1-8b85-dd0d63520cbf.webp',
            'content' => '
                <h2>Why Water Conservation Matters</h2>
                <p>Water conservation helps protect our environment, reduces strain on water treatment facilities, and can significantly lower your utility bills. The average household can save thousands of gallons per year with simple changes.</p>
                
                <img src="https://tracextech.com/wp-content/uploads/2023/05/water-conservation-in-sustainable-agriculture.png" alt="Water conservation concept" style="width: 100%; margin: 20px 0; border-radius: 8px;">
                
                <h2>Indoor Water Conservation</h2>
                <h3>Bathroom Water Saving</h3>
                <p>The bathroom accounts for about 60% of indoor water use. Here are effective ways to reduce consumption:</p>
                
                <h4>Shower Efficiency</h4>
                <ul>
                    <li>Install low-flow showerheads (2.5 gallons per minute or less)</li>
                    <li>Take shorter showers - aim for 5 minutes or less</li>
                    <li>Turn off water while soaping or shampooing</li>
                    <li>Fix leaky showerheads immediately</li>
                </ul>
                
                <img src="https://assets.visitorscoverage.com/production/wp-content/uploads/2024/01/water-conservation-header-1.webp?width=872" alt="Low-flow showerhead" style="width: 100%; margin: 20px 0; border-radius: 8px;">
                
                <h4>Toilet Water Savings</h4>
                <ul>
                    <li>Install dual-flush toilets or conversion kits</li>
                    <li>Place a water-filled bottle in older toilet tanks</li>
                    <li>Fix running toilets promptly</li>
                    <li>Don\'t use the toilet as a trash can</li>
                </ul>
                
                <h3>Kitchen Water Conservation</h3>
                <h4>Dishwashing Tips</h4>
                <ul>
                    <li>Run dishwashers only with full loads</li>
                    <li>Use the eco-cycle when available</li>
                    <li>Scrape dishes instead of pre-rinsing</li>
                    <li>Fix leaky faucets immediately</li>
                </ul>
                
                <h4>Cooking and Cleaning</h4>
                <ul>
                    <li>Keep a pitcher of drinking water in the refrigerator</li>
                    <li>Use minimal water when cooking pasta or vegetables</li>
                    <li>Collect water while waiting for it to heat up</li>
                    <li>Install aerators on kitchen faucets</li>
                </ul>
                
                <img src="https://sb.ecobnb.net/app/uploads/sites/3/2023/09/water-conservation-1170x490.jpg" alt="Kitchen water conservation" style="width: 100%; margin: 20px 0; border-radius: 8px;">
                
                <h2>Outdoor Water Conservation</h2>
                <h3>Lawn and Garden Watering</h3>
                <p>Outdoor water use can account for 30% or more of total household consumption. Smart watering practices can dramatically reduce this:</p>
                
                <h4>Efficient Watering Techniques</h4>
                <ul>
                    <li>Water early morning or late evening to reduce evaporation</li>
                    <li>Use drip irrigation or soaker hoses for gardens</li>
                    <li>Install rain sensors on sprinkler systems</li>
                    <li>Choose drought-resistant plants and grasses</li>
                    <li>Mulch around plants to retain moisture</li>
                </ul>
                
                <h3>Rainwater Harvesting</h3>
                <p>Collecting rainwater is an excellent way to reduce water bills and provide plants with chemical-free water:</p>
                
                <h4>Simple Rain Barrel Setup</h4>
                <ul>
                    <li>Install rain barrels under downspouts</li>
                    <li>Use collected water for gardens and lawns</li>
                    <li>Cover barrels to prevent mosquito breeding</li>
                    <li>Position barrels on stable, level surfaces</li>
                </ul>
                
                <img src="https://www.bestonewater.com/wp-content/uploads/2024/07/Firefly-hand-holding-earth-2.jpg" alt="Rainwater harvesting system" style="width: 100%; margin: 20px 0; border-radius: 8px;">
                
                <h2>Water-Efficient Appliances</h2>
                <h3>ENERGY STAR Appliances</h3>
                <p>When replacing appliances, choose ENERGY STAR certified models that use less water and energy:</p>
                
                <h4>Washing Machines</h4>
                <ul>
                    <li>Front-loading machines use 40% less water</li>
                    <li>Look for machines with adjustable water levels</li>
                    <li>Wash full loads when possible</li>
                    <li>Use cold water for most loads</li>
                </ul>
                
                <h4>Dishwashers</h4>
                <ul>
                    <li>ENERGY STAR dishwashers use 3.5 gallons or less per cycle</li>
                    <li>Look for soil sensors that adjust water use</li>
                    <li>Choose models with efficient wash cycles</li>
                </ul>
                
                <h2>Leak Detection and Repair</h2>
                <h3>Finding Hidden Leaks</h3>
                <p>Small leaks can waste thousands of gallons per year. Here\'s how to detect them:</p>
                
                <h4>Water Meter Test</h4>
                <ol>
                    <li>Turn off all water in your home</li>
                    <li>Check your water meter</li>
                    <li>Wait 2 hours without using water</li>
                    <li>Check the meter again - if it moved, you have a leak</li>
                </ol>
                
                <h4>Common Leak Locations</h4>
                <ul>
                    <li>Toilet flappers and fill valves</li>
                    <li>Faucet washers and O-rings</li>
                    <li>Showerhead connections</li>
                    <li>Pipe joints and connections</li>
                </ul>
                
                <img src="https://cdn.prod.website-files.com/67d275747293d41babdc0029/67f8fc334828809608511a9e_5d3c503e3dfa66216e3dbb7f_water-conservation-1.png" alt="Leak detection tools" style="width: 100%; margin: 20px 0; border-radius: 8px;">
                
                <h2>Cost Savings and Environmental Impact</h2>
                <h3>Financial Benefits</h3>
                <p>Water conservation can lead to significant savings:</p>
                <ul>
                    <li>Reduced water bills</li>
                    <li>Lower energy costs for heating water</li>
                    <li>Potential rebates for efficient appliances</li>
                    <li>Increased home value</li>
                </ul>
                
                <h3>Environmental Benefits</h3>
                <ul>
                    <li>Reduced strain on water treatment facilities</li>
                    <li>Protection of natural water sources</li>
                    <li>Lower energy consumption</li>
                    <li>Reduced pollution from treatment processes</li>
                </ul>
                
                <h2>Getting Started</h2>
                <p>Begin your water conservation journey with these simple steps:</p>
                <ol>
                    <li>Conduct a home water audit</li>
                    <li>Fix any existing leaks</li>
                    <li>Install low-flow fixtures</li>
                    <li>Change daily habits</li>
                    <li>Consider upgrading to efficient appliances</li>
                    <li>Implement outdoor conservation measures</li>
                </ol>
            '
        ]
    ];
    
    if (!isset($articles[$articleId])) {
        echo json_encode(['success' => false, 'message' => 'Article not found']);
        exit();
    }
    
    $article = $articles[$articleId];
    
    echo json_encode([
        'success' => true, 
        'article' => $article
    ]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
