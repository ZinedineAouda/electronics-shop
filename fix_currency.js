const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'app/(dashboard)/admin/merchant/[id]/page.tsx',
  'app/(dashboard)/admin/orders/[id]/page.tsx',
  'app/product/[productSlug]/page.tsx',
  'components/AdminOrders.tsx',
  'components/DashboardProductTable.tsx',
  'components/Filters.tsx',
  'components/ProductItem.tsx',
  'components/Range.tsx',
  'components/RangeWithLabels.tsx',
  'components/modules/cart/index.tsx'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.log("Not found:", filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace ${something} if it represents money. We know from grep that they are written like:
  // >${product?.price}<
  // >${total}<
  // $5, $0, etc.
  
  // Replace >${ with >DZA { 
  content = content.replace(/>\$\{/g, '>DZA {');
  
  // Replace " ${" with " DZA {" (e.g. Total: ${...} or Subtotal: ${...})
  content = content.replace(/: \$\{/g, ': DZA {');
  
  // Replace $ followed by numbers
  content = content.replace(/\$([0-9]+)/g, 'DZA $1');
  
  // Fix template literals like `$${currentRangeValue}` if any were affected by mistake
  // For Range.tsx: `Max price: $${currentRangeValue}` -> `Max price: DZA ${currentRangeValue}`
  content = content.replace(/Max price: \$\$\{/g, 'Max price: DZA ${');
  
  // For ProductItem.tsx:
  // \n        ${product.price}\n
  content = content.replace(/^\s*\$\{product\.price\}\s*$/gm, (match) => match.replace('$', 'DZA '));

  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Updated", file);
});
