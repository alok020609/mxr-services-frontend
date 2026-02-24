<template>
  <div class="import-products-page">
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Import Products</h1>
          <p class="text-gray-600 mt-2">Import products from file or enter them manually</p>
        </div>
        <Button variant="secondary" @click="$router.push({ name: 'AdminProducts' })">
          ← Back to Products
        </Button>
      </div>
    </div>

    <!-- Import Content (same as ImportModal but without Modal wrapper) -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Tabs -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="flex space-x-8">
          <button
            @click="activeTab = 'file'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'file'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            File Upload
          </button>
          <button
            @click="activeTab = 'manual'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'manual'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Manual Entry
          </button>
        </nav>
      </div>

      <!-- File Upload Tab -->
      <div v-if="activeTab === 'file'" class="space-y-6">
        <!-- Sample Template Downloads -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 class="text-sm font-medium text-blue-900 mb-3">Download Sample Templates</h3>
          <div class="flex flex-wrap gap-3">
            <Button variant="secondary" size="sm" @click="downloadTemplate('csv')">
              <svg class="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download CSV Template
            </Button>
            <Button variant="secondary" size="sm" @click="downloadTemplate('json')">
              <svg class="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download JSON Template
            </Button>
            <Button variant="secondary" size="sm" @click="downloadTemplate('xlsx')">
              <svg class="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download XLSX Template
            </Button>
          </div>
        </div>

        <!-- File Upload -->
        <div>
          <label class="block text-sm font-medium mb-2">Select File (CSV, JSON, XLSX)</label>
          <input
            ref="fileInput"
            type="file"
            @change="handleFileSelect"
            accept=".csv,.json,.xlsx"
            class="input"
          />
          <p class="text-xs text-gray-500 mt-1">
            Supported formats: CSV, JSON, XLSX. Max file size: 10MB
          </p>
        </div>

        <!-- Import Options -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium mb-3">Import Options</h3>
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="importOptions.skipHeader"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-700">Skip Header Row</span>
            </label>
            <p class="text-xs text-gray-500 ml-6">Skip the first row if it contains column headers (default: enabled)</p>
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="importOptions.validate"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-700">Validate Data</span>
            </label>
            <p class="text-xs text-gray-500 ml-6">Validate data before importing to catch errors early (default: enabled)</p>
          </div>
        </div>
        
        <!-- Format Requirements -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-sm font-medium mb-2">Format Requirements:</h3>
          <ul class="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>CSV: Headers in first row (name, description, price, sku, stock, categoryId, status, images, compareAtPrice, tags)</li>
            <li>JSON: Array of product objects with all fields</li>
            <li>XLSX: Same structure as CSV</li>
          </ul>
        </div>
        
        <!-- Progress Indicator -->
        <div v-if="importJobId" class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="font-medium">Import Status:</span>
            <span :class="getStatusClass(importStatus)" class="px-2 py-1 rounded">
              {{ importStatus || 'Processing...' }}
            </span>
          </div>
          <div v-if="importProgress > 0" class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-primary-600 h-2 rounded-full transition-all"
              :style="{ width: `${importProgress}%` }"
            ></div>
          </div>
          <p v-if="importProgress > 0" class="text-xs text-gray-600">
            {{ importProgress }}% complete
          </p>
        </div>
        
        <!-- Error Display -->
        <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>
        
        <!-- Success Display -->
        <div v-if="importResult && importStatus === 'completed'" class="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <p class="text-green-700 text-sm font-medium mb-2">Import completed successfully!</p>
          <ul class="text-xs text-green-600 space-y-1">
            <li v-if="importResult.successful">Successfully imported: {{ importResult.successful }}</li>
            <li v-if="importResult.failed">Failed: {{ importResult.failed }}</li>
            <li v-if="importResult.errors && importResult.errors.length > 0">
              Errors:
              <ul class="list-disc list-inside ml-2">
                <li v-for="(err, idx) in importResult.errors.slice(0, 5)" :key="idx">{{ err }}</li>
              </ul>
            </li>
          </ul>
        </div>

        <!-- Import Button -->
        <div class="flex justify-end">
          <Button
            variant="primary"
            @click="handleImport"
            :loading="isProcessing"
            :disabled="!selectedFile || isProcessing"
          >
            Import Products
          </Button>
        </div>
      </div>

      <!-- Manual Entry Tab - Include the table structure from ImportModal -->
      <div v-if="activeTab === 'manual'" class="space-y-4">
        <!-- Toolbar -->
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <Button variant="secondary" size="sm" @click="addProduct">
              + Add Row
            </Button>
            <span class="text-sm text-gray-600">
              {{ manualProducts.length }} product(s)
            </span>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">
              {{ validProductsCount }} ready to create
            </span>
            <Button
              variant="primary"
              @click="createAllProducts"
              :loading="isCreatingBatch"
              :disabled="validProductsCount === 0"
            >
              Create All ({{ validProductsCount }})
            </Button>
          </div>
        </div>

        <!-- Table Structure -->
        <div v-if="manualProducts.length === 0" class="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p class="text-gray-500 mb-4">No products added yet</p>
          <Button variant="secondary" @click="addProduct">
            Add Your First Product
          </Button>
        </div>

        <div v-else class="border rounded-lg overflow-auto" style="max-height: calc(100vh - 400px)">
          <table class="min-w-full divide-y divide-gray-200">
            <!-- Header Row -->
            <thead class="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r w-12">#</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[150px]">
                  Name <span class="text-red-500">*</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[200px]">
                  Description <span class="text-red-500">*</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[100px]">
                  Price <span class="text-red-500">*</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[100px]">
                  SKU <span class="text-red-500">*</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[80px]">
                  Stock <span class="text-red-500">*</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[150px]">
                  Category <span class="text-red-500">*</span>
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[100px]">
                  Status
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[100px]">
                  Compare At Price
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[100px]">
                  Original Price
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[100px]">
                  Slug
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[120px]">
                  Tags
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[100px]">
                  Badges
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[100px]">
                  Certifications
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[150px]">
                  Images
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[80px]">
                  Min Qty
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[80px]">
                  Max Qty
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[120px]">
                  Brand
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[120px]">
                  Model #
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[120px]">
                  Country
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[150px]">
                  Warranty
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[150px]">
                  Care
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[180px]">
                  Return Policy (JSON)
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[180px]">
                  Refund Policy (JSON)
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[180px]">
                  Shipping Policy (JSON)
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[180px]">
                  Exchange Policy (JSON)
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[180px]">
                  Cancellation Policy (JSON)
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[200px]">
                  Weight & Dimensions (JSON)
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[180px]">
                  Manufacturer Info (JSON)
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase border-r min-w-[180px]">
                  Specifications (JSON)
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-20">Actions</th>
              </tr>
            </thead>
            <!-- Data Rows -->
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(product, index) in manualProducts"
                :key="product.id"
                :class="[
                  'hover:bg-gray-50',
                  !isProductValid(product) ? 'bg-red-50' : ''
                ]"
              >
                <td class="px-3 py-2 text-sm text-gray-500 border-r">{{ index + 1 }}</td>
                
                <!-- Name -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model="product.name"
                    type="text"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    :class="getFieldErrorClass(product, 'name')"
                    placeholder="Product name"
                    @keydown="handleKeydown($event, index, 'name')"
                  />
                </td>
                
                <!-- Description -->
                <td class="px-3 py-2 border-r">
                  <textarea
                    v-model="product.description"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    :class="getFieldErrorClass(product, 'description')"
                    rows="2"
                    placeholder="Product description"
                    @keydown="handleKeydown($event, index, 'description')"
                  ></textarea>
                </td>
                
                <!-- Price -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model.number="product.price"
                    type="number"
                    step="0.01"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    :class="getFieldErrorClass(product, 'price')"
                    placeholder="0.00"
                    @keydown="handleKeydown($event, index, 'price')"
                  />
                </td>
                
                <!-- SKU -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model="product.sku"
                    type="text"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    :class="getFieldErrorClass(product, 'sku')"
                    placeholder="SKU-001"
                    @keydown="handleKeydown($event, index, 'sku')"
                  />
                </td>
                
                <!-- Stock -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model.number="product.stock"
                    type="number"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    :class="getFieldErrorClass(product, 'stock')"
                    placeholder="0"
                    @keydown="handleKeydown($event, index, 'stock')"
                  />
                </td>
                
                <!-- Category -->
                <td class="px-3 py-2 border-r">
                  <select
                    v-model="product.categoryId"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    :class="getFieldErrorClass(product, 'categoryId')"
                    @keydown="handleKeydown($event, index, 'categoryId')"
                  >
                    <option value="">Select category</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </td>
                
                <!-- Status -->
                <td class="px-3 py-2 border-r">
                  <select
                    v-model="product.status"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    @keydown="handleKeydown($event, index, 'status')"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </td>
                
                <!-- Compare At Price -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model.number="product.compareAtPrice"
                    type="number"
                    step="0.01"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0.00"
                    @keydown="handleKeydown($event, index, 'compareAtPrice')"
                  />
                </td>
                
                <!-- Original Price -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model.number="product.originalPrice"
                    type="number"
                    step="0.01"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0.00"
                    @keydown="handleKeydown($event, index, 'originalPrice')"
                  />
                </td>
                
                <!-- Slug -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model="product.slug"
                    type="text"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="product-slug"
                    @keydown="handleKeydown($event, index, 'slug')"
                  />
                </td>
                
                <!-- Tags -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model="product.tagsInput"
                    type="text"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="tag1, tag2"
                    @keydown="handleKeydown($event, index, 'tagsInput')"
                  />
                </td>
                
                <!-- Badges -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model="product.badgesInput"
                    type="text"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="New, Featured"
                    @keydown="handleKeydown($event, index, 'badgesInput')"
                  />
                </td>
                
                <!-- Certifications -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model="product.certificationsInput"
                    type="text"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="CE, FCC, RoHS"
                    @keydown="handleKeydown($event, index, 'certificationsInput')"
                  />
                </td>
                
                <!-- Images -->
                <td class="px-3 py-2 border-r">
                  <div class="flex items-center space-x-2">
                    <div v-if="product.images && product.images.length > 0" class="flex space-x-1">
                      <img
                        v-for="(img, idx) in product.images.slice(0, 2)"
                        :key="idx"
                        :src="img"
                        alt="Product image"
                        class="h-8 w-8 object-cover rounded border"
                      />
                      <span v-if="product.images.length > 2" class="text-xs text-gray-500 self-center">
                        +{{ product.images.length - 2 }}
                      </span>
                    </div>
                    <input
                      :ref="el => setImageInputRef(el, index)"
                      type="file"
                      accept="image/*"
                      multiple
                      class="hidden"
                      @change="handleImageUpload($event, index)"
                    />
                    <button
                      @click="triggerImageUpload(index)"
                      class="text-xs text-primary-600 hover:text-primary-800 px-2 py-1 border border-primary-300 rounded hover:bg-primary-50"
                    >
                      Upload
                    </button>
                  </div>
                </td>
                
                <!-- Min Order Quantity -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model.number="product.minOrderQuantity"
                    type="number"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="1"
                    @keydown="handleKeydown($event, index, 'minOrderQuantity')"
                  />
                </td>
                
                <!-- Max Order Quantity -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model.number="product.maxOrderQuantity"
                    type="number"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="10"
                    @keydown="handleKeydown($event, index, 'maxOrderQuantity')"
                  />
                </td>
                
                <!-- Brand -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model="product.brand"
                    type="text"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Brand name"
                    @keydown="handleKeydown($event, index, 'brand')"
                  />
                </td>
                
                <!-- Model Number -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model="product.modelNumber"
                    type="text"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Model-123"
                    @keydown="handleKeydown($event, index, 'modelNumber')"
                  />
                </td>
                
                <!-- Country of Origin -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model="product.countryOfOrigin"
                    type="text"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="China"
                    @keydown="handleKeydown($event, index, 'countryOfOrigin')"
                  />
                </td>
                
                <!-- Warranty Info -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model="product.warrantyInfo"
                    type="text"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="1 year warranty"
                    @keydown="handleKeydown($event, index, 'warrantyInfo')"
                  />
                </td>
                
                <!-- Care Instructions -->
                <td class="px-3 py-2 border-r">
                  <input
                    v-model="product.careInstructions"
                    type="text"
                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Clean with dry cloth"
                    @keydown="handleKeydown($event, index, 'careInstructions')"
                  />
                </td>
                
                <!-- Return Policy (JSON) -->
                <td class="px-3 py-2 border-r">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-16">window:</span>
                      <input
                        v-model="product.returnPolicyWindow"
                        type="text"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="30 days"
                        @keydown="handleKeydown($event, index, 'returnPolicyWindow')"
                      />
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-16">conditions:</span>
                      <input
                        v-model="product.returnPolicyConditions"
                        type="text"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="Item unused"
                        @keydown="handleKeydown($event, index, 'returnPolicyConditions')"
                      />
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-16">process:</span>
                      <input
                        v-model="product.returnPolicyProcess"
                        type="text"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="Contact support"
                        @keydown="handleKeydown($event, index, 'returnPolicyProcess')"
                      />
                    </div>
                  </div>
                </td>
                
                <!-- Refund Policy (JSON) -->
                <td class="px-3 py-2 border-r">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-16">method:</span>
                      <input
                        v-model="product.refundPolicyMethod"
                        type="text"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="original payment"
                        @keydown="handleKeydown($event, index, 'refundPolicyMethod')"
                      />
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-16">timeline:</span>
                      <input
                        v-model="product.refundPolicyTimeline"
                        type="text"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="7-14 days"
                        @keydown="handleKeydown($event, index, 'refundPolicyTimeline')"
                      />
                    </div>
                  </div>
                </td>
                
                <!-- Shipping Policy (JSON) -->
                <td class="px-3 py-2 border-r">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-16">deliveryTime:</span>
                      <input
                        v-model="product.shippingPolicyDeliveryTime"
                        type="text"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="3-5 days"
                        @keydown="handleKeydown($event, index, 'shippingPolicyDeliveryTime')"
                      />
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-16">methods:</span>
                      <input
                        v-model="product.shippingPolicyMethods"
                        type="text"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="standard,express"
                        @keydown="handleKeydown($event, index, 'shippingPolicyMethods')"
                      />
                    </div>
                  </div>
                </td>
                
                <!-- Exchange Policy (JSON) -->
                <td class="px-3 py-2 border-r">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-16">window:</span>
                      <input
                        v-model="product.exchangePolicyWindow"
                        type="text"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="14 days"
                        @keydown="handleKeydown($event, index, 'exchangePolicyWindow')"
                      />
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-16">conditions:</span>
                      <input
                        v-model="product.exchangePolicyConditions"
                        type="text"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="Unopened only"
                        @keydown="handleKeydown($event, index, 'exchangePolicyConditions')"
                      />
                    </div>
                  </div>
                </td>
                
                <!-- Cancellation Policy (JSON) -->
                <td class="px-3 py-2 border-r">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-16">window:</span>
                      <input
                        v-model="product.cancellationPolicyWindow"
                        type="text"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="24 hours"
                        @keydown="handleKeydown($event, index, 'cancellationPolicyWindow')"
                      />
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-16">fee:</span>
                      <input
                        v-model="product.cancellationPolicyFee"
                        type="text"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="10%"
                        @keydown="handleKeydown($event, index, 'cancellationPolicyFee')"
                      />
                    </div>
                  </div>
                </td>
                
                <!-- Weight & Dimensions (JSON) -->
                <td class="px-3 py-2 border-r">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-12">weight:</span>
                      <input
                        v-model.number="product.weightValue"
                        type="number"
                        step="0.1"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="1.5"
                        @keydown="handleKeydown($event, index, 'weightValue')"
                      />
                      <input
                        v-model="product.weightUnit"
                        type="text"
                        class="w-10 px-1 py-0.5 text-xs border rounded"
                        placeholder="kg"
                        @keydown="handleKeydown($event, index, 'weightUnit')"
                      />
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-12">length:</span>
                      <input
                        v-model.number="product.dimensionLength"
                        type="number"
                        step="0.1"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="10"
                        @keydown="handleKeydown($event, index, 'dimensionLength')"
                      />
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-12">width:</span>
                      <input
                        v-model.number="product.dimensionWidth"
                        type="number"
                        step="0.1"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="5"
                        @keydown="handleKeydown($event, index, 'dimensionWidth')"
                      />
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-12">height:</span>
                      <input
                        v-model.number="product.dimensionHeight"
                        type="number"
                        step="0.1"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="3"
                        @keydown="handleKeydown($event, index, 'dimensionHeight')"
                      />
                      <input
                        v-model="product.dimensionUnit"
                        type="text"
                        class="w-10 px-1 py-0.5 text-xs border rounded"
                        placeholder="cm"
                        @keydown="handleKeydown($event, index, 'dimensionUnit')"
                      />
                    </div>
                  </div>
                </td>
                
                <!-- Manufacturer Info (JSON) -->
                <td class="px-3 py-2 border-r">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-12">name:</span>
                      <input
                        v-model="product.manufacturerName"
                        type="text"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="Manufacturer"
                        @keydown="handleKeydown($event, index, 'manufacturerName')"
                      />
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-12">contact:</span>
                      <input
                        v-model="product.manufacturerContact"
                        type="text"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="support@example.com"
                        @keydown="handleKeydown($event, index, 'manufacturerContact')"
                      />
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-12">address:</span>
                      <input
                        v-model="product.manufacturerAddress"
                        type="text"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="123 Main St"
                        @keydown="handleKeydown($event, index, 'manufacturerAddress')"
                      />
                    </div>
                  </div>
                </td>
                
                <!-- Specifications (JSON) -->
                <td class="px-3 py-2 border-r">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-12">color:</span>
                      <input
                        v-model="product.specColor"
                        type="text"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="Black"
                        @keydown="handleKeydown($event, index, 'specColor')"
                      />
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-12">material:</span>
                      <input
                        v-model="product.specMaterial"
                        type="text"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="Plastic"
                        @keydown="handleKeydown($event, index, 'specMaterial')"
                      />
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-600 w-12">warranty:</span>
                      <input
                        v-model="product.specWarranty"
                        type="text"
                        class="flex-1 px-1 py-0.5 text-xs border rounded"
                        placeholder="1 year"
                        @keydown="handleKeydown($event, index, 'specWarranty')"
                      />
                    </div>
                  </div>
                </td>
                
                <!-- Actions -->
                <td class="px-3 py-2">
                  <button
                    @click="removeProduct(index)"
                    class="text-red-600 hover:text-red-800 text-sm"
                    title="Delete row"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Batch Create Progress & Results -->
        <div v-if="manualProducts.length > 0" class="border-t pt-4 space-y-4">
          <!-- Batch Create Progress -->
          <div v-if="batchCreateProgress.total > 0" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span>Creating products: {{ batchCreateProgress.current }} / {{ batchCreateProgress.total }}</span>
              <span>{{ Math.round((batchCreateProgress.current / batchCreateProgress.total) * 100) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-primary-600 h-2 rounded-full transition-all"
                :style="{ width: `${(batchCreateProgress.current / batchCreateProgress.total) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Batch Create Results -->
          <div v-if="batchCreateResults.length > 0" class="space-y-2 max-h-40 overflow-y-auto">
            <div
              v-for="(result, idx) in batchCreateResults"
              :key="idx"
              :class="[
                'p-2 rounded text-xs',
                result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              ]"
            >
              Product {{ idx + 1 }} ({{ result.product.name }}): {{ result.success ? 'Created' : result.error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { operationalApi } from '@/api/endpoints/operational'
import { productsApi } from '@/api/endpoints/products'
import { mediaApi } from '@/api/endpoints/media'
import { useUIStore } from '@/stores/ui'
import { normalizeImageUrl } from '@/utils/formatters'
import Modal from '@/components/common/Modal.vue'
import Button from '@/components/common/Button.vue'
import type { Category } from '@/api/types'

const router = useRouter()
const uiStore = useUIStore()
const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const isProcessing = ref(false)
const importJobId = ref<string | null>(null)
const importStatus = ref<string>('')
const importProgress = ref(0)
const importResult = ref<any>(null)
const error = ref<string | null>(null)
const activeTab = ref<'file' | 'manual'>('file')
const manualProducts = ref<any[]>([])
const categories = ref<Category[]>([])
const isCreatingBatch = ref(false)
const batchCreateProgress = ref({ current: 0, total: 0 })
const batchCreateResults = ref<any[]>([])
const imageInputRefs = ref<Map<string, HTMLInputElement>>(new Map())
const importOptions = ref({ skipHeader: true, validate: true })
let statusPollInterval: number | null = null

const validProductsCount = computed(() => {
  return manualProducts.value.filter(p => isProductValid(p)).length
})

const loadCategories = async () => {
  try {
    const response = await productsApi.getCategories()
    if (response.success && response.data) {
      categories.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const downloadTemplate = (format: 'csv' | 'json' | 'xlsx') => {
  let content = ''
  let filename = ''
  let mimeType = ''

  if (format === 'csv') {
    // Required fields: name, price, sku
    // All other fields are optional
    const headers = [
      'name', 'description', 'price', 'sku', 'stock', 'slug', 'categoryId', 'status',
      'images', 'compareAtPrice', 'originalPrice', 'tags', 'badges', 'certifications',
      'warrantyInfo', 'returnPolicy', 'refundPolicy', 'shippingPolicy', 'exchangePolicy',
      'cancellationPolicy', 'careInstructions', 'countryOfOrigin', 'manufacturerInfo',
      'brand', 'modelNumber', 'weightDimensions', 'minOrderQuantity', 'maxOrderQuantity',
      'specifications'
    ]
    // Example with proper JSON field formatting (escaped quotes for CSV)
    const returnPolicyExample = '{"window":"30 days","conditions":"Item must be unused","process":"Contact support"}'
    const weightDimensionsExample = '{"weight":{"value":1.5,"unit":"kg"},"dimensions":{"length":10,"width":5,"height":3,"unit":"cm"}}'
    const manufacturerInfoExample = '{"name":"TechBrand","contact":"support@example.com","address":"123 Main St"}'
    const specificationsExample = '{"color":"Black","material":"Plastic","warranty":"1 year"}'
    
    const example = [
      'Premium Headphones',
      'High-quality wireless headphones with noise cancellation',
      '199.99',
      'SKU-HEAD-001',
      '100',
      'premium-headphones',
      'category-id-here',
      'active',
      'https://example.com/image1.jpg,https://example.com/image2.jpg',
      '249.99',
      '219.99',
      'tag1, tag2, tag3',
      'New,Featured',
      'CE,FCC,RoHS',
      '1 year manufacturer warranty',
      `"${returnPolicyExample.replace(/"/g, '""')}"`, // Escape quotes for CSV
      '{"method":"original payment","timeline":"7-14 days"}',
      '{"deliveryTime":"3-5 days","methods":["standard","express"]}',
      '{"window":"14 days","conditions":"Unopened items only"}',
      '{"window":"24 hours","fee":"10% cancellation fee"}',
      'Clean with dry cloth only',
      'China',
      `"${manufacturerInfoExample.replace(/"/g, '""')}"`, // Escape quotes for CSV
      'TechBrand',
      'TB-HEAD-2024',
      `"${weightDimensionsExample.replace(/"/g, '""')}"`, // Escape quotes for CSV
      '1',
      '10',
      `"${specificationsExample.replace(/"/g, '""')}"` // Escape quotes for CSV
    ]
    content = [headers.join(','), example.join(',')].join('\n')
    filename = 'products-template.csv'
    mimeType = 'text/csv'
  } else if (format === 'json') {
    const example = [{
      name: 'Sample Product',
      description: 'This is a sample product description',
      price: 99.99,
      sku: 'SKU-001',
      stock: 100,
      categoryId: 'category-id-here',
      status: 'active',
      images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
      compareAtPrice: 149.99,
      tags: ['tag1', 'tag2', 'tag3']
    }]
    content = JSON.stringify(example, null, 2)
    filename = 'products-template.json'
    mimeType = 'application/json'
  } else if (format === 'xlsx') {
    // Same structure as CSV but tab-separated for Excel
    const headers = [
      'name', 'description', 'price', 'sku', 'stock', 'slug', 'categoryId', 'status',
      'images', 'compareAtPrice', 'originalPrice', 'tags', 'badges', 'certifications',
      'warrantyInfo', 'returnPolicy', 'refundPolicy', 'shippingPolicy', 'exchangePolicy',
      'cancellationPolicy', 'careInstructions', 'countryOfOrigin', 'manufacturerInfo',
      'brand', 'modelNumber', 'weightDimensions', 'minOrderQuantity', 'maxOrderQuantity',
      'specifications'
    ]
    const returnPolicyExample = '{"window":"30 days","conditions":"Item must be unused","process":"Contact support"}'
    const weightDimensionsExample = '{"weight":{"value":1.5,"unit":"kg"},"dimensions":{"length":10,"width":5,"height":3,"unit":"cm"}}'
    const manufacturerInfoExample = '{"name":"TechBrand","contact":"support@example.com","address":"123 Main St"}'
    const specificationsExample = '{"color":"Black","material":"Plastic","warranty":"1 year"}'
    
    const example = [
      'Premium Headphones',
      'High-quality wireless headphones with noise cancellation',
      '199.99',
      'SKU-HEAD-001',
      '100',
      'premium-headphones',
      'category-id-here',
      'active',
      'https://example.com/image1.jpg,https://example.com/image2.jpg',
      '249.99',
      '219.99',
      'tag1, tag2, tag3',
      'New,Featured',
      'CE,FCC,RoHS',
      '1 year manufacturer warranty',
      returnPolicyExample,
      '{"method":"original payment","timeline":"7-14 days"}',
      '{"deliveryTime":"3-5 days","methods":["standard","express"]}',
      '{"window":"14 days","conditions":"Unopened items only"}',
      '{"window":"24 hours","fee":"10% cancellation fee"}',
      'Clean with dry cloth only',
      'China',
      manufacturerInfoExample,
      'TechBrand',
      'TB-HEAD-2024',
      weightDimensionsExample,
      '1',
      '10',
      specificationsExample
    ]
    content = [headers.join('\t'), example.join('\t')].join('\n')
    filename = 'products-template.xlsx'
    mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  
  uiStore.showNotification('success', `Template downloaded: ${filename}`)
}

const addProduct = () => {
  const newProduct = {
    id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    sku: '',
    categoryId: '',
    status: 'draft' as 'active' | 'inactive' | 'draft',
    images: [] as string[],
    compareAtPrice: undefined as number | undefined,
    originalPrice: undefined as number | undefined,
    slug: '',
    tagsInput: '',
    tags: [] as string[],
    badgesInput: '',
    badges: [] as string[],
    certificationsInput: '',
    certifications: [] as string[],
    warrantyInfo: '',
    careInstructions: '',
    countryOfOrigin: '',
    brand: '',
    modelNumber: '',
    minOrderQuantity: undefined as number | undefined,
    maxOrderQuantity: undefined as number | undefined,
    // JSON fields - structured inputs
    // Return Policy
    returnPolicyWindow: '',
    returnPolicyConditions: '',
    returnPolicyProcess: '',
    returnPolicy: undefined as any,
    // Refund Policy
    refundPolicyMethod: '',
    refundPolicyTimeline: '',
    refundPolicy: undefined as any,
    // Shipping Policy
    shippingPolicyDeliveryTime: '',
    shippingPolicyMethods: '',
    shippingPolicy: undefined as any,
    // Exchange Policy
    exchangePolicyWindow: '',
    exchangePolicyConditions: '',
    exchangePolicy: undefined as any,
    // Cancellation Policy
    cancellationPolicyWindow: '',
    cancellationPolicyFee: '',
    cancellationPolicy: undefined as any,
    // Weight & Dimensions
    weightValue: undefined as number | undefined,
    weightUnit: '',
    dimensionLength: undefined as number | undefined,
    dimensionWidth: undefined as number | undefined,
    dimensionHeight: undefined as number | undefined,
    dimensionUnit: '',
    weightDimensions: undefined as any,
    // Manufacturer Info
    manufacturerName: '',
    manufacturerContact: '',
    manufacturerAddress: '',
    manufacturerInfo: undefined as any,
    // Specifications
    specColor: '',
    specMaterial: '',
    specWarranty: '',
    specifications: undefined as any
  }
  manualProducts.value.push(newProduct)
}

const removeProduct = (index: number) => {
  manualProducts.value.splice(index, 1)
  batchCreateResults.value = []
}

const handleKeydown = (event: KeyboardEvent, rowIndex: number, field: string) => {
  if (event.key === 'Tab') {
    event.preventDefault()
    const inputs = document.querySelectorAll(`tbody tr:nth-child(${rowIndex + 1}) input, tbody tr:nth-child(${rowIndex + 1}) select, tbody tr:nth-child(${rowIndex + 1}) textarea`)
    const currentIndex = Array.from(inputs).indexOf(event.target as HTMLElement)
    const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1
    
    if (nextIndex >= 0 && nextIndex < inputs.length) {
      (inputs[nextIndex] as HTMLElement).focus()
    } else if (nextIndex >= inputs.length && rowIndex < manualProducts.value.length - 1) {
      const nextRowInputs = document.querySelectorAll(`tbody tr:nth-child(${rowIndex + 2}) input, tbody tr:nth-child(${rowIndex + 2}) select, tbody tr:nth-child(${rowIndex + 2}) textarea`)
      if (nextRowInputs.length > 0) {
        (nextRowInputs[0] as HTMLElement).focus()
      }
    }
  } else if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    if (rowIndex < manualProducts.value.length - 1) {
      const nextRowInputs = document.querySelectorAll(`tbody tr:nth-child(${rowIndex + 2}) input, tbody tr:nth-child(${rowIndex + 2}) select, tbody tr:nth-child(${rowIndex + 2}) textarea`)
      const currentInputs = document.querySelectorAll(`tbody tr:nth-child(${rowIndex + 1}) input, tbody tr:nth-child(${rowIndex + 1}) select, tbody tr:nth-child(${rowIndex + 1}) textarea`)
      const currentIndex = Array.from(currentInputs).indexOf(event.target as HTMLElement)
      if (nextRowInputs[currentIndex]) {
        (nextRowInputs[currentIndex] as HTMLElement).focus()
      }
    }
  }
}

const setImageInputRef = (el: any, index: number) => {
  if (el) {
    imageInputRefs.value.set(`image_${index}`, el)
  }
}

const triggerImageUpload = (index: number) => {
  const input = imageInputRefs.value.get(`image_${index}`)
  if (input) {
    input.click()
  }
}

const handleImageUpload = async (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const files = Array.from(target.files)
  const product = manualProducts.value[index]

  try {
    const response = await mediaApi.uploadMultipleImages(files, {
      folder: 'products',
      optimize: true
    })

    if (response.success && response.data) {
      const uploadedImages = Array.isArray(response.data) 
        ? response.data.map((img: any) => normalizeImageUrl(img.url || img))
        : [normalizeImageUrl(response.data.url || response.data)]
      
      product.images = [...(product.images || []), ...uploadedImages]
      uiStore.showNotification('success', `Uploaded ${uploadedImages.length} image(s)`)
    } else {
      uiStore.showNotification('error', response.error || 'Failed to upload images')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to upload images')
  } finally {
    if (target) {
      target.value = ''
    }
  }
}

const validateProduct = (product: any): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  if (!product.name || product.name.trim() === '') {
    errors.name = 'Product name is required'
  }
  if (!product.description || product.description.trim() === '') {
    errors.description = 'Description is required'
  }
  if (!product.price || product.price <= 0) {
    errors.price = 'Price must be greater than 0'
  }
  if (product.stock === undefined || product.stock < 0) {
    errors.stock = 'Stock cannot be negative'
  }
  if (!product.sku || product.sku.trim() === '') {
    errors.sku = 'SKU is required'
  }
  if (!product.categoryId) {
    errors.categoryId = 'Category is required'
  }
  
  return errors
}

const isProductValid = (product: any): boolean => {
  const errors = validateProduct(product)
  return Object.keys(errors).length === 0
}

const getFieldError = (product: any, field: string): string => {
  const errors = validateProduct(product)
  return errors[field] || ''
}

const getFieldErrorClass = (product: any, field: string): string => {
  const error = getFieldError(product, field)
  return error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
}

const parseJsonField = (fieldValue: string): any => {
  if (!fieldValue || fieldValue.trim() === '') return undefined
  try {
    return JSON.parse(fieldValue)
  } catch (e) {
    console.warn('Invalid JSON in field:', fieldValue, e)
    return undefined
  }
}

const prepareProductData = (product: any) => {
  // Parse comma-separated fields
  const tags = product.tagsInput
    ? product.tagsInput.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
    : []
  const badges = product.badgesInput
    ? product.badgesInput.split(',').map((b: string) => b.trim()).filter((b: string) => b.length > 0)
    : []
  const certifications = product.certificationsInput
    ? product.certificationsInput.split(',').map((c: string) => c.trim()).filter((c: string) => c.length > 0)
    : []

  const productData: any = {
    name: product.name,
    description: product.description,
    price: product.price,
    sku: product.sku
  }

  // Required fields
  if (product.stock !== undefined) productData.stock = product.stock
  if (product.categoryId) productData.categoryId = product.categoryId
  if (product.status) productData.status = product.status
  if (product.images && product.images.length > 0) productData.images = product.images

  // Optional basic fields
  if (product.compareAtPrice !== undefined && product.compareAtPrice > 0) {
    productData.compareAtPrice = product.compareAtPrice
  }
  if (product.originalPrice !== undefined && product.originalPrice > 0) {
    productData.originalPrice = product.originalPrice
  }
  if (product.slug && product.slug.trim()) {
    productData.slug = product.slug.trim()
  }

  // Comma-separated arrays
  if (tags.length > 0) productData.tags = tags
  if (badges.length > 0) productData.badges = badges
  if (certifications.length > 0) productData.certifications = certifications

  // String fields
  if (product.warrantyInfo && product.warrantyInfo.trim()) {
    productData.warrantyInfo = product.warrantyInfo.trim()
  }
  if (product.careInstructions && product.careInstructions.trim()) {
    productData.careInstructions = product.careInstructions.trim()
  }
  if (product.countryOfOrigin && product.countryOfOrigin.trim()) {
    productData.countryOfOrigin = product.countryOfOrigin.trim()
  }
  if (product.brand && product.brand.trim()) {
    productData.brand = product.brand.trim()
  }
  if (product.modelNumber && product.modelNumber.trim()) {
    productData.modelNumber = product.modelNumber.trim()
  }

  // Number fields
  if (product.minOrderQuantity !== undefined && product.minOrderQuantity > 0) {
    productData.minOrderQuantity = product.minOrderQuantity
  }
  if (product.maxOrderQuantity !== undefined && product.maxOrderQuantity > 0) {
    productData.maxOrderQuantity = product.maxOrderQuantity
  }

  // JSON fields - build from structured inputs (only include if at least one field is filled)
  // Return Policy
  const returnPolicy: any = {}
  if (product.returnPolicyWindow && product.returnPolicyWindow.trim()) returnPolicy.window = product.returnPolicyWindow.trim()
  if (product.returnPolicyConditions && product.returnPolicyConditions.trim()) returnPolicy.conditions = product.returnPolicyConditions.trim()
  if (product.returnPolicyProcess && product.returnPolicyProcess.trim()) returnPolicy.process = product.returnPolicyProcess.trim()
  if (Object.keys(returnPolicy).length > 0) productData.returnPolicy = returnPolicy

  // Refund Policy
  const refundPolicy: any = {}
  if (product.refundPolicyMethod && product.refundPolicyMethod.trim()) refundPolicy.method = product.refundPolicyMethod.trim()
  if (product.refundPolicyTimeline && product.refundPolicyTimeline.trim()) refundPolicy.timeline = product.refundPolicyTimeline.trim()
  if (Object.keys(refundPolicy).length > 0) productData.refundPolicy = refundPolicy

  // Shipping Policy
  const shippingPolicy: any = {}
  if (product.shippingPolicyDeliveryTime && product.shippingPolicyDeliveryTime.trim()) shippingPolicy.deliveryTime = product.shippingPolicyDeliveryTime.trim()
  if (product.shippingPolicyMethods && product.shippingPolicyMethods.trim()) {
    shippingPolicy.methods = product.shippingPolicyMethods.split(',').map((m: string) => m.trim()).filter((m: string) => m.length > 0)
  }
  if (Object.keys(shippingPolicy).length > 0) productData.shippingPolicy = shippingPolicy

  // Exchange Policy
  const exchangePolicy: any = {}
  if (product.exchangePolicyWindow && product.exchangePolicyWindow.trim()) exchangePolicy.window = product.exchangePolicyWindow.trim()
  if (product.exchangePolicyConditions && product.exchangePolicyConditions.trim()) exchangePolicy.conditions = product.exchangePolicyConditions.trim()
  if (Object.keys(exchangePolicy).length > 0) productData.exchangePolicy = exchangePolicy

  // Cancellation Policy
  const cancellationPolicy: any = {}
  if (product.cancellationPolicyWindow && product.cancellationPolicyWindow.trim()) cancellationPolicy.window = product.cancellationPolicyWindow.trim()
  if (product.cancellationPolicyFee && product.cancellationPolicyFee.trim()) cancellationPolicy.fee = product.cancellationPolicyFee.trim()
  if (Object.keys(cancellationPolicy).length > 0) productData.cancellationPolicy = cancellationPolicy

  // Weight & Dimensions
  const weightDimensions: any = {}
  if (product.weightValue !== undefined && product.weightValue > 0 || product.weightUnit && product.weightUnit.trim()) {
    weightDimensions.weight = {}
    if (product.weightValue !== undefined && product.weightValue > 0) weightDimensions.weight.value = product.weightValue
    if (product.weightUnit && product.weightUnit.trim()) weightDimensions.weight.unit = product.weightUnit.trim()
  }
  if (product.dimensionLength !== undefined || product.dimensionWidth !== undefined || product.dimensionHeight !== undefined || product.dimensionUnit && product.dimensionUnit.trim()) {
    weightDimensions.dimensions = {}
    if (product.dimensionLength !== undefined) weightDimensions.dimensions.length = product.dimensionLength
    if (product.dimensionWidth !== undefined) weightDimensions.dimensions.width = product.dimensionWidth
    if (product.dimensionHeight !== undefined) weightDimensions.dimensions.height = product.dimensionHeight
    if (product.dimensionUnit && product.dimensionUnit.trim()) weightDimensions.dimensions.unit = product.dimensionUnit.trim()
  }
  if (Object.keys(weightDimensions).length > 0) productData.weightDimensions = weightDimensions

  // Manufacturer Info
  const manufacturerInfo: any = {}
  if (product.manufacturerName && product.manufacturerName.trim()) manufacturerInfo.name = product.manufacturerName.trim()
  if (product.manufacturerContact && product.manufacturerContact.trim()) manufacturerInfo.contact = product.manufacturerContact.trim()
  if (product.manufacturerAddress && product.manufacturerAddress.trim()) manufacturerInfo.address = product.manufacturerAddress.trim()
  if (Object.keys(manufacturerInfo).length > 0) productData.manufacturerInfo = manufacturerInfo

  // Specifications
  const specifications: any = {}
  if (product.specColor && product.specColor.trim()) specifications.color = product.specColor.trim()
  if (product.specMaterial && product.specMaterial.trim()) specifications.material = product.specMaterial.trim()
  if (product.specWarranty && product.specWarranty.trim()) specifications.warranty = product.specWarranty.trim()
  if (Object.keys(specifications).length > 0) productData.specifications = specifications

  return productData
}

const createAllProducts = async () => {
  const validProducts = manualProducts.value.filter(p => isProductValid(p))
  
  if (validProducts.length === 0) {
    uiStore.showNotification('error', 'No valid products to create')
    return
  }

  isCreatingBatch.value = true
  batchCreateProgress.value = { current: 0, total: validProducts.length }
  batchCreateResults.value = []

  const results: any[] = []

  for (let i = 0; i < validProducts.length; i++) {
    const product = validProducts[i]
    batchCreateProgress.value.current = i + 1

    try {
      const productData = prepareProductData(product)
      const response = await productsApi.createProduct(productData)
      
      results.push({
        success: response.success,
        product: product,
        error: response.error || null
      })

      if (response.success) {
        batchCreateResults.value.push({
          success: true,
          product: product,
          error: null
        })
      } else {
        batchCreateResults.value.push({
          success: false,
          product: product,
          error: response.error || 'Failed to create product'
        })
      }
    } catch (error: any) {
      results.push({
        success: false,
        product: product,
        error: error.message || 'Failed to create product'
      })
      batchCreateResults.value.push({
        success: false,
        product: product,
        error: error.message || 'Failed to create product'
      })
    }
  }

  const successCount = results.filter(r => r.success).length
  const failCount = results.filter(r => !r.success).length

  if (successCount > 0) {
    uiStore.showNotification('success', `Successfully created ${successCount} product(s)`)
    router.push({ name: 'AdminProducts' })
  }
  if (failCount > 0) {
    uiStore.showNotification('error', `Failed to create ${failCount} product(s)`)
  }

  isCreatingBatch.value = false
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
    error.value = null
    
    const validTypes = ['.csv', '.json', '.xlsx']
    const fileName = selectedFile.value.name.toLowerCase()
    if (!validTypes.some(type => fileName.endsWith(type))) {
      error.value = 'Invalid file type. Please select a CSV, JSON, or XLSX file.'
      selectedFile.value = null
      return
    }
    
    if (selectedFile.value.size > 10 * 1024 * 1024) {
      error.value = 'File size exceeds 10MB limit.'
      selectedFile.value = null
      return
    }
  }
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    queued: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  }
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const pollImportStatus = async () => {
  if (!importJobId.value) return
  
  try {
    const response = await operationalApi.getImportStatus(importJobId.value)
    
    if (response.success && response.data) {
      importStatus.value = response.data.status || 'processing'
      importProgress.value = response.data.progress || 0
      
      if (importStatus.value === 'completed') {
        stopPolling()
        await fetchImportResult()
      } else if (importStatus.value === 'failed') {
        stopPolling()
        error.value = response.data.error || 'Import failed'
      }
    }
  } catch (err: any) {
    console.error('Error polling import status:', err)
    stopPolling()
    error.value = err.message || 'Failed to check import status'
  }
}

const fetchImportResult = async () => {
  if (!importJobId.value) return
  
  try {
    const response = await operationalApi.getImportResult(importJobId.value)
    if (response.success && response.data) {
      importResult.value = response.data
      uiStore.showNotification('success', 'Import completed successfully!')
      setTimeout(() => {
        router.push({ name: 'AdminProducts' })
      }, 2000)
    }
  } catch (err: any) {
    console.error('Error fetching import result:', err)
  }
}

const startPolling = () => {
  if (statusPollInterval) {
    clearInterval(statusPollInterval)
  }
  statusPollInterval = window.setInterval(pollImportStatus, 2000)
}

const stopPolling = () => {
  if (statusPollInterval) {
    clearInterval(statusPollInterval)
    statusPollInterval = null
  }
}

const handleImport = async () => {
  if (!selectedFile.value) {
    error.value = 'Please select a file'
    return
  }
  
  isProcessing.value = true
  error.value = null
  importStatus.value = ''
  importProgress.value = 0
  importResult.value = null
  
  try {
    const options = {
      skipHeader: importOptions.value.skipHeader,
      validate: importOptions.value.validate
    }
    const response = await operationalApi.importData(selectedFile.value, 'PRODUCTS', options)
    
    if (response.success && response.data) {
      importJobId.value = response.data.jobId || response.data.id
      importStatus.value = 'queued'
      startPolling()
    } else {
      error.value = response.error || 'Failed to start import'
      isProcessing.value = false
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to import products'
    isProcessing.value = false
    uiStore.showNotification('error', 'Failed to import products')
  }
}

onMounted(() => {
  loadCategories()
})

onUnmounted(() => {
  stopPolling()
})
</script>

