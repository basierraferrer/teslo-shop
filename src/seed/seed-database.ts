import {initialData} from './seed';
import prisma from '../lib/prisma';

async function main() {
  // 1. Borrar registros previos
  await Promise.all([
    prisma.orderItem.deleteMany(),
    prisma.orderAddress.deleteMany(),
    prisma.order.deleteMany(),
    prisma.userAddress.deleteMany(),
    prisma.user.deleteMany(),
    prisma.country.deleteMany(),
    prisma.product.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.category.deleteMany(),
  ]);

  const {categories, products, users, countries} = initialData;

  await prisma.user.createMany({
    data: users,
  });

  // Paises
  await prisma.country.createMany({
    data: countries,
  });

  //  Categorias
  // {
  //   name: 'Shirt'
  // }
  const categoriesData = categories.map(name => ({name}));

  await prisma.category.createMany({
    data: categoriesData,
  });

  const categoriesDB = await prisma.category.findMany();

  const categoriesMap = categoriesDB.reduce(
    (map, category) => {
      map[category.name.toLowerCase()] = category.id;
      return map;
    },
    {} as Record<string, string>,
  ); //<string=shirt, string=categoryID>

  // Productos

  products.forEach(async product => {
    const {type, images, ...rest} = product;

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type],
      },
    });

    // Images
    const imagesData = images.map(image => ({
      url: image,
      productId: dbProduct.id,
    }));

    await prisma.productImage.createMany({
      data: imagesData,
    });
  });

  // Orders

  console.log('Seed ejecutado correctamente');
}

(() => {
  if (process.env.NODE_ENV === 'production') return;

  main();
})();
