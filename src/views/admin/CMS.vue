<template>
  <AdminLayout>
    <div>
      <h1 class="text-3xl font-bold mb-8">Content Management</h1>
      
      <!-- Tabs -->
      <div class="border-b mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 font-medium border-b-2 transition-colors',
            activeTab === tab.id
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <!-- Pages Tab -->
      <div v-if="activeTab === 'pages'">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Pages</h2>
          <Button variant="primary" @click="showPageModal = true">
            Add Page
          </Button>
        </div>
        
        <div v-if="isLoading" class="mb-4 flex items-center text-gray-600">
          <LoadingSpinner size="sm" />
          <span class="ml-2">Loading pages...</span>
        </div>
        
        <div v-if="pages.length === 0 && !isLoading" class="text-center py-12 border rounded-lg">
          <p class="text-gray-500">No pages found</p>
        </div>
        
        <DataTable
          v-else
          :columns="pageColumns"
          :data="pages"
          :actions="true"
          row-key="slug"
        >
          <template #actions="{ row }">
            <button @click="editPage(row)" class="text-primary-600 mr-4">Edit</button>
            <button @click="deletePage(row.slug)" class="text-red-600">Delete</button>
          </template>
        </DataTable>
      </div>
      
      <!-- Blog Tab -->
      <div v-if="activeTab === 'blog'">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Blog Posts</h2>
          <Button variant="primary" @click="showBlogModal = true">
            Add Blog Post
          </Button>
        </div>
        
        <div v-if="isLoading" class="mb-4 flex items-center text-gray-600">
          <LoadingSpinner size="sm" />
          <span class="ml-2">Loading blog posts...</span>
        </div>
        
        <div v-if="blogPosts.length === 0 && !isLoading" class="text-center py-12 border rounded-lg">
          <p class="text-gray-500">No blog posts found</p>
        </div>
        
        <DataTable
          v-else
          :columns="blogColumns"
          :data="blogPosts"
          :actions="true"
          row-key="slug"
        >
          <template #actions="{ row }">
            <button @click="editBlogPost(row)" class="text-primary-600 mr-4">Edit</button>
            <button @click="deleteBlogPost(row.slug)" class="text-red-600">Delete</button>
          </template>
        </DataTable>
      </div>
      
      <!-- Banners Tab -->
      <div v-if="activeTab === 'banners'">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">Banners</h2>
          <Button variant="primary" @click="showBannerModal = true">
            Add Banner
          </Button>
        </div>
        
        <div v-if="isLoading" class="mb-4 flex items-center text-gray-600">
          <LoadingSpinner size="sm" />
          <span class="ml-2">Loading banners...</span>
        </div>
        
        <div v-if="banners.length === 0 && !isLoading" class="text-center py-12 border rounded-lg">
          <p class="text-gray-500">No banners found</p>
        </div>
        
        <DataTable
          v-else
          :columns="bannerColumns"
          :data="banners"
          :actions="true"
          row-key="id"
        >
          <template #actions="{ row }">
            <button @click="editBanner(row)" class="text-primary-600 mr-4">Edit</button>
            <button @click="deleteBanner(row.id)" class="text-red-600">Delete</button>
          </template>
        </DataTable>
      </div>
      
      <!-- Page Modal -->
      <div
        v-if="showPageModal || editingPage"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closePageModal"
      >
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h2 class="text-2xl font-bold mb-4">{{ editingPage ? 'Edit Page' : 'Create Page' }}</h2>
          <form @submit.prevent="handlePageSubmit" class="space-y-4">
            <Input v-model="pageForm.title" label="Title" required />
            <Input v-model="pageForm.slug" label="Slug" required />
            <div>
              <label class="block text-sm font-medium mb-2">Content</label>
              <textarea
                v-model="pageForm.content"
                class="input"
                rows="10"
                required
              ></textarea>
            </div>
            <div class="flex justify-end space-x-4">
              <Button type="button" variant="secondary" @click="closePageModal">Cancel</Button>
              <Button type="submit" variant="primary" :loading="isSaving">Save</Button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Blog Modal -->
      <div
        v-if="showBlogModal || editingBlogPost"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeBlogModal"
      >
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h2 class="text-2xl font-bold mb-4">{{ editingBlogPost ? 'Edit Blog Post' : 'Create Blog Post' }}</h2>
          <form @submit.prevent="handleBlogSubmit" class="space-y-4">
            <Input v-model="blogForm.title" label="Title" required />
            <Input v-model="blogForm.slug" label="Slug" required />
            <Input v-model="blogForm.excerpt" label="Excerpt" />
            <div>
              <label class="block text-sm font-medium mb-2">Content</label>
              <textarea
                v-model="blogForm.content"
                class="input"
                rows="10"
                required
              ></textarea>
            </div>
            <div class="flex justify-end space-x-4">
              <Button type="button" variant="secondary" @click="closeBlogModal">Cancel</Button>
              <Button type="submit" variant="primary" :loading="isSaving">Save</Button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Banner Modal -->
      <div
        v-if="showBannerModal || editingBanner"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeBannerModal"
      >
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <h2 class="text-2xl font-bold mb-4">{{ editingBanner ? 'Edit Banner' : 'Create Banner' }}</h2>
          <form @submit.prevent="handleBannerSubmit" class="space-y-4">
            <Input v-model="bannerForm.title" label="Title" required />
            <Input v-model="bannerForm.imageUrl" label="Image URL" required />
            <Input v-model="bannerForm.linkUrl" label="Link URL" />
            <div>
              <label class="block text-sm font-medium mb-2">Status</label>
              <select v-model="bannerForm.status" class="input">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div class="flex justify-end space-x-4">
              <Button type="button" variant="secondary" @click="closeBannerModal">Cancel</Button>
              <Button type="submit" variant="primary" :loading="isSaving">Save</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { cmsApi } from '@/api/endpoints/cms'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import AdminLayout from './AdminLayout.vue'
import DataTable from '@/components/admin/DataTable.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'

const uiStore = useUIStore()
const activeTab = ref<'pages' | 'blog' | 'banners'>('pages')
const isLoading = ref(false)
const isSaving = ref(false)

const tabs = [
  { id: 'pages', label: 'Pages' },
  { id: 'blog', label: 'Blog Posts' },
  { id: 'banners', label: 'Banners' }
]

const pages = ref<any[]>([])
const blogPosts = ref<any[]>([])
const banners = ref<any[]>([])

const pageColumns = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'slug', label: 'Slug', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true }
]

const blogColumns = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'slug', label: 'Slug', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true }
]

const bannerColumns = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true }
]

const showPageModal = ref(false)
const showBlogModal = ref(false)
const showBannerModal = ref(false)
const editingPage = ref<any>(null)
const editingBlogPost = ref<any>(null)
const editingBanner = ref<any>(null)

const pageForm = ref({
  title: '',
  slug: '',
  content: ''
})

const blogForm = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: ''
})

const bannerForm = ref({
  title: '',
  imageUrl: '',
  linkUrl: '',
  status: 'active'
})

const loadPages = async () => {
  try {
    const response = await cmsApi.getPages()
    sendToTerminal('log', '[CMS] Pages response:', response)
    if (response.success && response.data) {
      pages.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error) {
    sendToTerminal('error', '[CMS] Error loading pages:', error)
  }
}

const loadBlogPosts = async () => {
  try {
    const response = await cmsApi.getBlog()
    sendToTerminal('log', '[CMS] Blog response:', response)
    if (response.success && response.data) {
      blogPosts.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error) {
    sendToTerminal('error', '[CMS] Error loading blog posts:', error)
  }
}

const loadBanners = async () => {
  try {
    const response = await cmsApi.getBanners()
    sendToTerminal('log', '[CMS] Banners response:', response)
    if (response.success && response.data) {
      banners.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error) {
    sendToTerminal('error', '[CMS] Error loading banners:', error)
  }
}

const loadAll = async () => {
  isLoading.value = true
  try {
    await Promise.all([loadPages(), loadBlogPosts(), loadBanners()])
  } catch (error) {
    uiStore.showNotification('error', 'Failed to load CMS content')
  } finally {
    isLoading.value = false
  }
}

const editPage = (page: any) => {
  editingPage.value = page
  pageForm.value = {
    title: page.title || '',
    slug: page.slug || '',
    content: page.content || ''
  }
}

const editBlogPost = (post: any) => {
  editingBlogPost.value = post
  blogForm.value = {
    title: post.title || '',
    slug: post.slug || '',
    excerpt: post.excerpt || '',
    content: post.content || ''
  }
}

const editBanner = (banner: any) => {
  editingBanner.value = banner
  bannerForm.value = {
    title: banner.title || '',
    imageUrl: banner.imageUrl || banner.image || '',
    linkUrl: banner.linkUrl || banner.link || '',
    status: banner.status || 'active'
  }
}

const closePageModal = () => {
  showPageModal.value = false
  editingPage.value = null
  pageForm.value = { title: '', slug: '', content: '' }
}

const closeBlogModal = () => {
  showBlogModal.value = false
  editingBlogPost.value = null
  blogForm.value = { title: '', slug: '', excerpt: '', content: '' }
}

const closeBannerModal = () => {
  showBannerModal.value = false
  editingBanner.value = null
  bannerForm.value = { title: '', imageUrl: '', linkUrl: '', status: 'active' }
}

const handlePageSubmit = async () => {
  isSaving.value = true
  try {
    let response
    if (editingPage.value) {
      response = await cmsApi.updatePage(editingPage.value.slug, pageForm.value)
    } else {
      response = await cmsApi.createPage(pageForm.value)
    }
    
    if (response.success) {
      uiStore.showNotification('success', editingPage.value ? 'Page updated successfully' : 'Page created successfully')
      closePageModal()
      await loadPages()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to save page')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to save page')
  } finally {
    isSaving.value = false
  }
}

const handleBlogSubmit = async () => {
  isSaving.value = true
  try {
    let response
    if (editingBlogPost.value) {
      response = await cmsApi.updateBlogPost(editingBlogPost.value.slug, blogForm.value)
    } else {
      response = await cmsApi.createBlogPost(blogForm.value)
    }
    
    if (response.success) {
      uiStore.showNotification('success', editingBlogPost.value ? 'Blog post updated successfully' : 'Blog post created successfully')
      closeBlogModal()
      await loadBlogPosts()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to save blog post')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to save blog post')
  } finally {
    isSaving.value = false
  }
}

const handleBannerSubmit = async () => {
  isSaving.value = true
  try {
    let response
    if (editingBanner.value) {
      response = await cmsApi.updateBanner(editingBanner.value.id, bannerForm.value)
    } else {
      response = await cmsApi.createBanner(bannerForm.value)
    }
    
    if (response.success) {
      uiStore.showNotification('success', editingBanner.value ? 'Banner updated successfully' : 'Banner created successfully')
      closeBannerModal()
      await loadBanners()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to save banner')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to save banner')
  } finally {
    isSaving.value = false
  }
}

const deletePage = async (slug: string) => {
  if (!confirm('Are you sure you want to delete this page?')) return
  
  try {
    const response = await cmsApi.deletePage(slug)
    if (response.success) {
      uiStore.showNotification('success', 'Page deleted successfully')
      await loadPages()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to delete page')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to delete page')
  }
}

const deleteBlogPost = async (slug: string) => {
  if (!confirm('Are you sure you want to delete this blog post?')) return
  
  try {
    const response = await cmsApi.deleteBlogPost(slug)
    if (response.success) {
      uiStore.showNotification('success', 'Blog post deleted successfully')
      await loadBlogPosts()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to delete blog post')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to delete blog post')
  }
}

const deleteBanner = async (id: string) => {
  if (!confirm('Are you sure you want to delete this banner?')) return
  
  try {
    const response = await cmsApi.deleteBanner(id)
    if (response.success) {
      uiStore.showNotification('success', 'Banner deleted successfully')
      await loadBanners()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to delete banner')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to delete banner')
  }
}

onMounted(() => {
  loadAll()
})
</script>
