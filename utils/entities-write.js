var mobs=[[    
	 50,
	 51,
	 52,
	 53,
	 54,
	 55,
	 56,
	 57,
	 58,
	 59,
	 60,
	 61,
	 62,
	 63,
	 64,
	 65,
	 66,
	 67,
	 68,
	 90,
	 91,
	 92,
	 93,
	 94,
	 95,
	 96,
	 97,
	 98,
	 99,
	 100,
	 101,
	 120
],[            
	'Creeper', //0.6	1.8
	'Skeleton', //	0.6	1.8
	'Spider', //	1.4	0.9
	'Giant Zombie', //	3.6	10.8
	'Zombie', //	0.6	1.8
	'Slime', //	0.6 * size	0.6 * size
	'Ghast', //	4	4
	'Zombie Pigman', //	0.6	1.8
	'Enderman', //	0.6	2.9
	'Cave Spider', //	0.7	0.5
	'Silverfish', //	0.3	0.7
	'Blaze', //	0.6	1.8
	'Magma Cube', //	0.6 * size	0.6 * size
	'Ender Dragon', //	16.0	8.0
	'Wither', //	0.9	4.0
	'Bat', //	0.5	0.9
	'Witch', //	0.6	1.8
	'Endermite', //	0.4	0.3
	'Guardian', //	0.85	0.85
	'Pig', //	0.9	0.9
	'Sheep', //	0.9	1.3
	'Cow', //	0.9	1.3
	'Chicken', //	0.3	0.7
	'Squid', //	0.95	0.95
	'Wolf', //	0.6	0.8
	'Mooshroom', //	0.9	1.3
	'Snowman', //	0.4	1.8
	'Ocelot', //	0.6	0.8
	'Iron Golem', //	1.4	2.9
	'Horse', //	1.4	1.6
	'Rabbit', //	0.6	0.7
	'Villager' //	0.6	1.8 
],[
	0.6, 
	0.6, 
	1.4,
	3.6, 
	0.6, 
	0.6, 
	4, 
	0.6, 
	0.6, 
	0.7, 
	0.3,
	0.6, 
	0.6, 
	16.0, 
	0.9, 
	0.5, 
	0.6, 
	0.4, 
	0.85, 
	0.9,
	0.9, 
	0.9, 
	0.3, 
	0.95, 
	0.6, 
	0.9,
	0.4, 
	0.6, 
	1.4, 
	1.4, 
	0.6, 
	0.6 
],[
	1.8,
	1.8,
	0.9,
	10.8,
	1.8,
	0.6,
	4,
	1.8,
	2.9,
	0.5,
	0.7,
	1.8,
	0.6,
	8.0,
	4.0,
	0.9,
	1.8,
	0.3,
	0.85,
	0.9,
	1.3,
	1.3,
	0.7,
	0.95,
	0.8,
	1.3,
	1.8,
	0.8,
	2.9,
	1.6,
	0.7,
	1.8 
]];

require('fs').writeFile('./mobs.json',JSON.stringify(mobs));






var objects=[[            
	1,
	2,
	10,
	//case 11: (unused since 1.6.x)	Minecart (storage)	0.98	0.7
	//case 12: (unused since 1.6.x)	Minecart (powered)	0.98	0.7
	50,
	51,
	60,
	61,
	62,
	63,
	64,
	65,
	66,
	70,
	71,
	72,
	73,
	74,
	75,
	76,
	77,
	78,
	90          
],[
	'Boat',
	'Item Stack',
	'Minecart',
	'Activated TNT',
	'EnderCrystal',
	'Arrow',
	'Snowball',
	'Egg',
	'FireBall',
	'FireCharge',
	'Thrown Enderpearl',
	'Wither Skull',
	'Falling Objects',
	'Item frames',
	'Eye of Ender',
	'Thrown Potion',
	'Falling Dragon Egg',
	'Thrown Exp Bottle',
	'Firework Rocket',
	'Leash Knot',
	'ArmorStand',
	'Fishing Float'
],[
	1.5,
	0.25,
	0.98,
	0.98,
	2.0,
	0.5,
	0.25,
	0.25,
	1.0,
	0.3125,
	0.25,
	0.3125,
	0.98,
	-1,
	0.25,
	0.98,
	0.25,
	0.25,
	0.5,
	0.5,
	0.25
],[
	0.6,
	0.25,
	0.7,
	0.98,
	2.0,
	0.5,
	0.25,
	0.25,
	1.0,
	0.3125,
	0.25,
	0.3125,
	0.98,
	-1,
	0.25,
	0.98,
	0.25,
	0.25,
	0.5,
	2.0,
	0.25
]];
require('fs').writeFile('./objects.json',JSON.stringify(objects));

