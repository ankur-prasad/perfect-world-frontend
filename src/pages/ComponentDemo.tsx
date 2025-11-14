import ProductCard07 from '@/components/commerce-ui/product-card-07'
import Banner07 from '@/components/commerce-ui/banner-07'
import Review01 from '@/components/commerce-ui/review-01'
import Cart01 from '@/components/commerce-ui/cart-01'

export default function ComponentDemo() {
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-4 max-w-7xl space-y-20">

        {/* Banner Demo */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Banner Component</h2>
          <Banner07 />
        </section>

        {/* Product Card Demo */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Product Card Component</h2>
          <ProductCard07
            productName="Perfect World T-Shirt"
            description="Premium sustainable fashion piece made with organic materials"
            price={49.99}
            imageUrl="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"
            inStock={true}
            features={[
              "100% Organic Cotton",
              "Fair Trade Certified",
              "Carbon Neutral Shipping",
              "Lifetime Guarantee"
            ]}
            onAddToCart={() => alert('Added to cart!')}
            onBuyNow={() => alert('Buy now clicked!')}
          />
        </section>

        {/* Review Demo */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Review Component</h2>
          <div className="bg-white/5 p-8 rounded-lg">
            <Review01
              reviewerName="Sarah Johnson"
              rating={5}
              reviewText="This is the best sustainable clothing I've ever purchased. The quality is outstanding and I love supporting such an ethical company!"
              reviewDate="2 weeks ago"
            />
          </div>
        </section>

        {/* Cart Demo */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Cart Component</h2>
          <Cart01
            products={[
              {
                id: '1',
                name: 'Perfect World T-Shirt',
                price: 49.99,
                quantity: 2,
                imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200'
              },
              {
                id: '2',
                name: 'Sustainable Hoodie',
                price: 79.99,
                quantity: 1,
                imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200'
              }
            ]}
          />
        </section>

      </div>
    </div>
  )
}
