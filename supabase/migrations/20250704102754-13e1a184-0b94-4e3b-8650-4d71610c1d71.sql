
-- Add more diverse and attractive rewards
INSERT INTO public.rewards (title, description, type, value, points_required, provider, validity_days, active) VALUES
-- More Airtime Options
('Ksh 500 Airtime', 'Safaricom airtime credit', 'airtime', 'Ksh 500', 4500, 'Safaricom', 30, true),
('Ksh 1000 Airtime', 'Safaricom airtime credit', 'airtime', 'Ksh 1000', 8500, 'Safaricom', 30, true),
('Ksh 300 Telkom Airtime', 'Telkom airtime credit', 'airtime', 'Ksh 300', 2800, 'Telkom', 30, true),
('Ksh 500 Telkom Airtime', 'Telkom airtime credit', 'airtime', 'Ksh 500', 4500, 'Telkom', 30, true),

-- Premium Data Bundles
('10GB Data Bundle', 'Safaricom data bundle', 'data', '10GB', 7000, 'Safaricom', 30, true),
('20GB Data Bundle', 'Safaricom data bundle', 'data', '20GB', 13000, 'Safaricom', 30, true),
('Weekly Unlimited Data', 'Safaricom unlimited weekly', 'data', 'Unlimited 7 days', 6000, 'Safaricom', 7, true),
('Monthly Unlimited Data', 'Safaricom unlimited monthly', 'data', 'Unlimited 30 days', 20000, 'Safaricom', 30, true),
('5GB Airtel Data', 'Airtel data bundle', 'data', '5GB', 3500, 'Airtel', 30, true),
('10GB Airtel Data', 'Airtel data bundle', 'data', '10GB', 7000, 'Airtel', 30, true),

-- Shopping & Entertainment Discounts
('Ksh 500 off Jumia', 'Shopping discount voucher', 'discount', 'Ksh 500 off', 1200, 'Jumia', 30, true),
('Ksh 1000 off Jumia', 'Shopping discount voucher', 'discount', 'Ksh 1000 off', 2200, 'Jumia', 30, true),
('Netflix 1 Month Free', 'Free Netflix subscription', 'discount', '1 Month Netflix', 3000, 'Netflix', 30, true),
('Spotify Premium 3 Months', 'Free Spotify Premium', 'discount', '3 Months Premium', 2500, 'Spotify', 90, true),
('50% off Uber Rides', 'Uber discount code', 'discount', '50% off (up to 500)', 1500, 'Uber', 14, true),
('Free Delivery Glovo', 'Free delivery voucher', 'discount', '5 Free Deliveries', 800, 'Glovo', 30, true),

-- Food & Restaurants
('Ksh 200 off KFC', 'KFC meal discount', 'discount', 'Ksh 200 off', 600, 'KFC', 30, true),
('Ksh 500 off Pizza Inn', 'Pizza discount voucher', 'discount', 'Ksh 500 off', 1200, 'Pizza Inn', 30, true),
('Buy 1 Get 1 Java Coffee', 'Coffee deal voucher', 'discount', 'BOGO Coffee', 400, 'Java House', 14, true),
('30% off Mama Oliech', 'Restaurant discount', 'discount', '30% off meal', 800, 'Mama Oliech', 30, true),

-- Health & Fitness
('Gym Membership 1 Month', 'Free gym access', 'discount', '1 Month Membership', 5000, 'Westlands Gym', 30, true),
('Health Checkup Discount', 'Medical checkup voucher', 'discount', '40% off checkup', 2000, 'Nairobi Hospital', 60, true),
('Yoga Classes 5 Sessions', 'Yoga class package', 'discount', '5 Sessions', 1800, 'Zen Yoga', 30, true),

-- Education & Skills
('Coursera Course Free', 'Free online course', 'discount', '1 Course Access', 2500, 'Coursera', 90, true),
('Udemy Course 50% off', 'Online learning discount', 'discount', '50% off any course', 1500, 'Udemy', 30, true),
('Language Class Discount', 'Language learning deal', 'discount', '30% off classes', 2000, 'Alliance Francaise', 60, true),

-- Transportation
('Matatu Credit Ksh 200', 'Public transport credit', 'discount', 'Ksh 200 Credit', 500, 'Little Cab', 30, true),
('Boda Boda Discount', 'Motorcycle taxi discount', 'discount', '40% off 3 rides', 600, 'SafeBoda', 14, true),
('SGR Ticket 20% off', 'Train ticket discount', 'discount', '20% off ticket', 1000, 'Kenya Railways', 30, true),

-- Premium Rewards
('iPhone Airpods', 'Apple AirPods (3rd Gen)', 'electronics', 'AirPods', 50000, 'Apple Store', 365, true),
('Samsung Galaxy Buds', 'Wireless earbuds', 'electronics', 'Galaxy Buds', 35000, 'Samsung', 365, true),
('Smartwatch', 'Fitness smartwatch', 'electronics', 'Smart Watch', 80000, 'Xiaomi', 365, true),
('Power Bank 20000mAh', 'Portable charger', 'electronics', '20000mAh Power Bank', 15000, 'Anker', 365, true),

-- Eco-Friendly Rewards
('Solar Power Bank', 'Eco-friendly charger', 'electronics', 'Solar Power Bank', 12000, 'EcoTech', 365, true),
('Bamboo Water Bottle', 'Sustainable water bottle', 'eco', 'Bamboo Bottle', 2500, 'EcoLife', 365, true),
('Organic Vegetable Box', 'Fresh organic produce', 'eco', 'Weekly Veg Box', 1800, 'Organic Farms', 7, true),
('Tree Planting Certificate', 'Plant a tree in your name', 'eco', '5 Trees Planted', 1000, 'Green Kenya', 365, true);
