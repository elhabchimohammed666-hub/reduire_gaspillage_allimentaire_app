import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { User } from './models/User.js';
import { FoodListing } from './models/FoodListing.js';
import { Reservation } from './models/Reservation.js';

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/food_surplus_db');
    console.log('Connecté à MongoDB pour le seed...');

    // Nettoyage des collections
    await Reservation.deleteMany({});
    await FoodListing.deleteMany({});
    await User.deleteMany({});

    // 1. Création des utilisateurs de test
    const donor1 = await User.create({
      name: 'Boulangerie Le Moulin Doré',
      email: 'boulangerie@moulin.com',
      password: 'password123',
      role: 'donor',
      phone: '01 45 67 89 10',
      organizationName: 'Le Moulin Doré SAS',
      isVerified: true,
      address: {
        street: '15 Rue de Rivoli',
        city: 'Paris',
        postalCode: '75004',
        formattedAddress: '15 Rue de Rivoli, 75004 Paris',
      },
      location: {
        type: 'Point',
        // [longitude, latitude]
        coordinates: [2.3553, 48.8566],
      },
    });

    const donor2 = await User.create({
      name: 'Trattoria Bella Roma',
      email: 'trattoria@bellaroma.com',
      password: 'password123',
      role: 'donor',
      phone: '01 42 33 44 55',
      organizationName: 'Bella Roma Restaurant',
      isVerified: true,
      address: {
        street: '28 Boulevard Saint-Germain',
        city: 'Paris',
        postalCode: '75005',
        formattedAddress: '28 Boulevard Saint-Germain, 75005 Paris',
      },
      location: {
        type: 'Point',
        coordinates: [2.3488, 48.8505],
      },
    });

    const donor3 = await User.create({
      name: 'Supermarché Bio Nature & Co',
      email: 'bio@natureco.com',
      password: 'password123',
      role: 'donor',
      phone: '01 48 00 11 22',
      organizationName: 'Bio Nature & Co',
      isVerified: true,
      address: {
        street: '42 Rue Montorgueil',
        city: 'Paris',
        postalCode: '75002',
        formattedAddress: '42 Rue Montorgueil, 75002 Paris',
      },
      location: {
        type: 'Point',
        coordinates: [2.3467, 48.8647],
      },
    });

    const beneficiary = await User.create({
      name: 'Association Solidarité Partage',
      email: 'solidarite@partage.org',
      password: 'password123',
      role: 'beneficiary',
      phone: '06 12 34 56 78',
      organizationName: 'Solidarité Partage',
      isVerified: true,
      address: {
        street: '10 Rue de Châteaudun',
        city: 'Paris',
        postalCode: '75009',
        formattedAddress: '10 Rue de Châteaudun, 75009 Paris',
      },
      location: {
        type: 'Point',
        coordinates: [2.3392, 48.8756],
      },
    });

    const admin = await User.create({
      name: 'Administrateur Plateforme',
      email: 'admin@foodsurplus.org',
      password: 'adminpassword123',
      role: 'admin',
      isVerified: true,
    });

    console.log('✅ Utilisateurs créés avec succès');

    // 2. Création des offres alimentaires avec géolocalisation
    const now = new Date();
    const tonight = new Date(now.getTime() + 6 * 60 * 60 * 1000); // dans 6h
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const listings = [
      {
        donorId: donor1._id,
        title: 'Panier de viennoiseries & pains artisanaux',
        description:
          'Assortiment du jour : 4 croissants au beurre, 3 pains au chocolat, et 2 baguettes tradition au levain. Tous cuits ce matin !',
        category: 'bakery',
        quantity: '3 paniers disponibles',
        originalPrice: 15.5,
        discountedPrice: 3.99,
        isFree: false,
        pickupStart: now,
        pickupEnd: tonight,
        location: {
          type: 'Point',
          coordinates: [2.3553, 48.8566], // Rivoli
        },
        address: {
          street: '15 Rue de Rivoli',
          city: 'Paris',
          postalCode: '75004',
          formattedAddress: '15 Rue de Rivoli, 75004 Paris',
        },
        status: 'available',
        dietaryTags: ['vegetarian'],
        images: [
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        ],
      },
      {
        donorId: donor2._id,
        title: 'Lasagnes maison & focaccia au romarin',
        description:
          'Plats cuisinés du service du midi. Portion généreuse prête à réchauffer. Conditionné en barquette recyclable.',
        category: 'meals',
        quantity: '5 barquettes',
        originalPrice: 18.0,
        discountedPrice: 4.5,
        isFree: false,
        pickupStart: now,
        pickupEnd: tonight,
        location: {
          type: 'Point',
          coordinates: [2.3488, 48.8505], // Saint-Germain
        },
        address: {
          street: '28 Boulevard Saint-Germain',
          city: 'Paris',
          postalCode: '75005',
          formattedAddress: '28 Boulevard Saint-Germain, 75005 Paris',
        },
        status: 'available',
        dietaryTags: ['halal'],
        images: [
          'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=600&q=80',
        ],
      },
      {
        donorId: donor3._id,
        title: 'Caisse Fruits & Légumes Bio de saison',
        description:
          'Pommes, bananes un peu mûres, carottes fanes et courgettes bio. Idéal pour soupes, compotes ou smoothies ! Don gratuit pour éviter le gaspillage.',
        category: 'produce',
        quantity: '4 caisses de 3kg',
        originalPrice: 12.0,
        discountedPrice: 0,
        isFree: true,
        pickupStart: now,
        pickupEnd: tomorrow,
        location: {
          type: 'Point',
          coordinates: [2.3467, 48.8647], // Montorgueil
        },
        address: {
          street: '42 Rue Montorgueil',
          city: 'Paris',
          postalCode: '75002',
          formattedAddress: '42 Rue Montorgueil, 75002 Paris',
        },
        status: 'available',
        dietaryTags: ['vegan', 'gluten-free'],
        images: [
          'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
        ],
      },
      {
        donorId: donor1._id,
        title: 'Lot de Pâtisseries fines (Tartes aux fruits)',
        description:
          'Tartelettes aux framboises et éclairs au café réalisés ce matin. Conservation au frais requise.',
        category: 'bakery',
        quantity: '2 boîtes',
        originalPrice: 14.0,
        discountedPrice: 0,
        isFree: true,
        pickupStart: now,
        pickupEnd: tonight,
        location: {
          type: 'Point',
          coordinates: [2.3553, 48.8566],
        },
        address: {
          street: '15 Rue de Rivoli',
          city: 'Paris',
          postalCode: '75004',
          formattedAddress: '15 Rue de Rivoli, 75004 Paris',
        },
        status: 'available',
        dietaryTags: ['vegetarian'],
        images: [
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        ],
      },
    ];

    await FoodListing.insertMany(listings);
    console.log(`✅ ${listings.length} offres alimentaires créées avec géolocalisation`);

    console.log('\n--- Comptes de test créés : ---');
    console.log('1. Donateur Boulangerie : boulangerie@moulin.com / password123');
    console.log('2. Donateur Resto : trattoria@bellaroma.com / password123');
    console.log('3. Donateur Bio : bio@natureco.com / password123');
    console.log('4. Bénéficiaire : solidarite@partage.org / password123');
    console.log('5. Administrateur : admin@foodsurplus.org / adminpassword123');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur seed:', error);
    process.exit(1);
  }
};

seedData();
