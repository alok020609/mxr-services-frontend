<template>
  <aside
    :class="[
      'fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white z-40 transform transition-transform duration-300 shadow-xl',
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    ]"
  >
    <div class="p-4 h-full flex flex-col">
      <div class="mb-6 pb-4 border-b border-gray-700">
        <h2 class="text-xl font-bold text-white">Admin Panel</h2>
        <p class="text-sm text-gray-400 mt-1">Management Console</p>
      </div>
      <nav 
        ref="navRef"
        class="space-y-1 flex-1 overflow-y-auto overflow-x-hidden"
        @scroll="handleScroll"
      >
        <router-link
          to="/admin"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin', true) 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </router-link>
        <router-link
          to="/admin/users"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/users') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Users
        </router-link>
        <router-link
          to="/admin/products"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/products') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Products
        </router-link>
        <router-link
          to="/admin/products/advanced"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/products/advanced') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Advanced Products
        </router-link>
        <router-link
          to="/admin/products/questions"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/products/questions') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Product Questions
        </router-link>
        <router-link
          to="/admin/categories"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/categories') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Categories
        </router-link>
        <router-link
          to="/admin/orders"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/orders') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Orders
        </router-link>
        <router-link
          to="/admin/inventory"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/inventory') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Inventory
        </router-link>
        <router-link
          to="/admin/inventory/advanced"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/inventory/advanced') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          Advanced Inventory
        </router-link>
        <router-link
          to="/admin/payment-gateways"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/payment-gateways') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Payment Gateways
        </router-link>
        <router-link
          to="/admin/email-services"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/email-services') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email Services
        </router-link>
        <router-link
          to="/admin/services"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/services') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Services
        </router-link>
        <router-link
          to="/admin/payments/advanced"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/payments/advanced') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Advanced Payments
        </router-link>
        <router-link
          to="/admin/analytics"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/analytics') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Analytics
        </router-link>
        <router-link
          to="/admin/analytics/advanced"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/analytics/advanced') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Advanced Analytics
        </router-link>
        
        <!-- Content & Media -->
        <router-link
          to="/admin/cms"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/cms') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          CMS
        </router-link>
        <router-link
          to="/admin/media"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/media') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Media
        </router-link>
        
        <!-- Marketing & Sales -->
        <router-link
          to="/admin/coupons"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/coupons') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          Coupons
        </router-link>
        <router-link
          to="/admin/marketing"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/marketing') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          Marketing
        </router-link>
        
        <!-- Customer Management -->
        <router-link
          to="/admin/crm"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/crm') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          CRM
        </router-link>
        <router-link
          to="/admin/compliance"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/compliance') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Compliance
        </router-link>
        
        <!-- Operations -->
        <router-link
          to="/admin/operations"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/operations') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Operations
        </router-link>
        <router-link
          to="/admin/logistics-providers"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/logistics-providers') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Logistics Providers
        </router-link>
        <router-link
          to="/admin/logistics"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/logistics') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Logistics
        </router-link>
        <router-link
          to="/admin/search-index"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/search-index') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search Index
        </router-link>
        <router-link
          to="/admin/jobs"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/jobs') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Job Queue
        </router-link>
        
        <!-- System & Infrastructure -->
        <router-link
          to="/admin/monitoring"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/monitoring') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Monitoring
        </router-link>
        <router-link
          to="/admin/observability"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/observability') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Observability
        </router-link>
        <router-link
          to="/admin/disaster-recovery"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/disaster-recovery') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Disaster Recovery
        </router-link>
        <router-link
          to="/admin/migrations"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/migrations') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Migrations
        </router-link>
        
        <!-- Configuration -->
        <router-link
          to="/admin/settings"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/settings') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </router-link>
        <router-link
          to="/admin/currencies"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/currencies') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Currencies
        </router-link>
        <router-link
          to="/admin/languages"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/languages') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.196 2.196l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Languages
        </router-link>
        <router-link
          to="/admin/feature-flags"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/feature-flags') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Feature Flags
        </router-link>
        
        <!-- API Management -->
        <router-link
          to="/admin/api/deprecation"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/api/deprecation') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          API Deprecation
        </router-link>
        <router-link
          to="/admin/api/gateway"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/api/gateway') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
          API Gateway
        </router-link>
        
        <!-- Advanced -->
        <router-link
          to="/admin/advanced"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/advanced') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Advanced
        </router-link>
        <router-link
          to="/admin/stores"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/stores') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Stores
        </router-link>
        <router-link
          to="/admin/integrations"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/integrations') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Integrations
        </router-link>
        <router-link
          to="/admin/mobile"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/mobile') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Mobile
        </router-link>
        <router-link
          to="/admin/tenants"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/admin/tenants') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Tenants
        </router-link>
      </nav>
    </div>
  </aside>
  
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
    @click="$emit('close')"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch, onUpdated } from 'vue'
import { useRoute } from 'vue-router'

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  close: []
}>()

const route = useRoute()
const navRef = ref<HTMLElement | null>(null)
const scrollPosition = ref(0)
let scrollTimeout: ReturnType<typeof setTimeout> | null = null

// Save scroll position with debouncing
const saveScrollPosition = () => {
  if (navRef.value) {
    scrollPosition.value = navRef.value.scrollTop
    // Store in sessionStorage as backup
    sessionStorage.setItem('adminSidebarScroll', scrollPosition.value.toString())
  }
}

// Debounced scroll handler to avoid excessive saves
const handleScroll = () => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  scrollTimeout = setTimeout(() => {
    saveScrollPosition()
  }, 100)
}

// Restore scroll position
const restoreScrollPosition = () => {
  if (navRef.value) {
    // Try to restore from sessionStorage first, then from ref
    const savedPosition = sessionStorage.getItem('adminSidebarScroll')
    const position = savedPosition ? parseInt(savedPosition, 10) : scrollPosition.value
    
    if (position > 0) {
      nextTick(() => {
        if (navRef.value) {
          navRef.value.scrollTop = position
        }
      })
    }
  }
}

// Restore scroll position on mount
onMounted(() => {
  restoreScrollPosition()
  
  // Also restore after a short delay to handle any async rendering
  setTimeout(() => {
    restoreScrollPosition()
  }, 100)
})

// Restore scroll position after component updates (handles re-renders from errors)
onUpdated(() => {
  // Only restore if we have a saved position and current position is 0 (was reset)
  if (navRef.value) {
    const currentScroll = navRef.value.scrollTop
    const savedPosition = sessionStorage.getItem('adminSidebarScroll')
    
    // Only restore if scroll was reset to top (0) but we have a saved position
    if (currentScroll === 0 && savedPosition) {
      const position = parseInt(savedPosition, 10)
      if (position > 0) {
        // Use requestAnimationFrame for smooth restoration
        requestAnimationFrame(() => {
          if (navRef.value) {
            navRef.value.scrollTop = position
          }
        })
      }
    }
  }
})

// Watch for route changes and restore scroll
watch(() => route.path, () => {
  // Small delay to ensure DOM is updated
  nextTick(() => {
    restoreScrollPosition()
  })
})

// Save scroll position before unmount
onBeforeUnmount(() => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
  saveScrollPosition()
})

const isActive = (path: string, exact: boolean = false) => {
  if (exact) {
    return route.path === path
  }
  // Special handling for advanced routes - they should not highlight parent routes
  const advancedRoutes = ['/admin/inventory/advanced', '/admin/analytics/advanced', '/admin/products/advanced']
  if (advancedRoutes.includes(route.path)) {
    // Only match if the path exactly matches (for advanced routes)
    return route.path === path
  }
  // For regular routes, check if path starts with the route but exclude advanced routes
  if (route.path.startsWith(path)) {
    // Don't highlight parent if we're on an advanced route
    if (path === '/admin/inventory' && route.path === '/admin/inventory/advanced') {
      return false
    }
    if (path === '/admin/analytics' && route.path === '/admin/analytics/advanced') {
      return false
    }
    if (path === '/admin/products' && route.path === '/admin/products/advanced') {
      return false
    }
    // Don't highlight /admin/api when on specific API routes
    if (path === '/admin/api' && (route.path === '/admin/api/deprecation' || route.path === '/admin/api/gateway')) {
      return false
    }
    return route.path !== '/admin'
  }
  return false
}
</script>

