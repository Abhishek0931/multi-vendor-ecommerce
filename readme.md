Core Modules & Features:

1. 👥 User Management
	•	Buyer / Vendor / Admin roles
	•	Register & Login (JWT auth)
	•	Profile update
	•	Admin can block/unblock vendors or users

2. 🛍 Product Management
	•	Vendors can:
	•	Create products (name, desc, price, category, quantity, images, tags)
	•	Update/delete own products
	•	Admin can approve/reject products
	•	Buyers can view all approved products

3. 🛒 Cart System
	•	Add/update/remove items in cart
	•	Each cart is tied to user
	•	Cart has vendor-specific separation (1 vendor per order or allow multi-vendor cart — your choice)

4. 💳 Order Management
	•	Place order (single or multi-vendor split)
	•	Pay via Stripe/Razorpay
	•	Order status flow: pending → paid → shipped → delivered
	•	Vendors can view and fulfill only their orders
	•	Admin sees everything

5. 📦 Inventory Management
	•	Auto reduce stock on order
	•	Notify vendor if stock low

6. 💬 Reviews & Ratings
	•	Buyers can rate/review products
	•	Prevent review spam (only after purchase)

7. 🔎 Search & Filters
	•	Search products by keyword
	•	Filter by price, category, vendor, ratings

8. 📊 Admin Dashboard (API only)
	•	View total sales, users, vendors, orders, top-selling products
	•	Change vendor status
	•	Approve/reject products