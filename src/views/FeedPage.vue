<template>
  <div class="container mx-auto py-6">
    <!-- Title centered horizontally -->
    <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">
      Users List
    </h1>
    <!-- Filter and Button Container -->
    <!-- Adjusted HTML for filter inputs with margins -->
    <div class="mb-4">
      <div class="flex flex-wrap gap-6 mb-4">
        <input
          v-model="filters.name"
          type="text"
          placeholder="Filter by Name"
          class="input-field w-full sm:w-1/3 lg:w-1/4 mb-4 sm:mb-0"
        />
        <input
          v-model="filters.age"
          type="number"
          placeholder="Filter by Age"
          class="input-field w-full sm:w-1/3 lg:w-1/4 mb-4 sm:mb-0"
        />
        <input
          v-model="filters.email"
          type="email"
          placeholder="Filter by Email"
          class="input-field w-full sm:w-1/3 lg:w-1/4 mb-4 sm:mb-0"
        />
        <select
          v-model="filters.role"
          class="input-field w-full sm:w-1/3 lg:w-1/4 mb-4 sm:mb-0"
        >
          <option value="">All Roles</option>
          <option v-for="role in roles" :key="role" :value="role">
            {{ role }}
          </option>
        </select>
        <input
          v-model="filters.joinedDate"
          type="date"
          class="input-field w-full sm:w-1/3 lg:w-1/4 mb-4 sm:mb-0"
        />
      </div>
      <div class="flex justify-end">
        <button @click="openModal()" class="btn btn-primary">
          Add New User
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Age
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Role
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Joined
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Profile
            </th>
            <th
              class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="user in paginatedUsers"
            :key="user.firestoreId"
            class="hover:bg-gray-100 transition duration-200 ease-in-out"
          >
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
            >
              {{ user.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.age }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
              {{ user.role }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.joinedDate }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
              <img
                v-if="user.imageUrl"
                :src="user.imageUrl"
                alt="Profile Picture"
                class="w-12 h-12 object-cover rounded-full image-class"
              />
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
              <button
                @click="openModal(user)"
                class="btn-icon text-gray-500 hover:text-gray-700"
              >
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button
                @click="deleteUser(user.firestoreId)"
                class="btn-icon text-gray-500 hover:text-gray-700"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination -->
    <div
      class="mt-4 flex justify-between items-center"
      v-if="paginatedUsers.length > 0"
    >
      <button
        @click="previousPage"
        :disabled="currentPage === 1"
        class="btn btn-secondary"
      >
        Previous
      </button>
      <span class="text-gray-700">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="btn btn-secondary"
      >
        Next
      </button>
    </div>
    <!-- Add/Edit User Modal -->
    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2 class="text-xl font-bold mb-4 text-gray-800">
          {{ isEditing ? "Edit User" : "Add New User" }}
        </h2>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name:</label>
            <input
              v-model="user.name"
              type="text"
              class="input-field"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Age:</label>
            <input
              v-model="user.age"
              type="number"
              class="input-field"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Email:</label
            >
            <input
              v-model="user.email"
              type="email"
              class="input-field"
              required
            />
          </div>
          <!-- Select Dropdown for Role -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Role:</label>
            <select v-model="user.role" class="input-field" required>
              <option value="" disabled>Select a role</option>
              <option v-for="role in roles" :key="role" :value="role">
                {{ role }}
              </option>
            </select>
          </div>
          <div style="margin-top: 10px">
            <label class="block text-sm font-medium text-gray-700"
              >Profile Picture:</label
            >
            <input
              @change="handleImageUpload"
              type="file"
              accept="image/*"
              class="input-field"
            />
            <img
              v-if="user.imageUrl"
              :src="user.imageUrl"
              alt="Profile Picture"
              class="image-class"
            />
          </div>
          <div class="flex justify-end space-x-2">
            <button type="submit" class="btn btn-primary">
              {{ isEditing ? "Update" : "Add" }}
            </button>
            <button type="button" @click="closeModal" class="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { inject } from "vue";
import { useToast } from "vue-toastification";

const db = inject("db");
const toast = useToast();

const users = ref([]);
const isModalOpen = ref(false);
const isEditing = ref(false);
const user = ref({
  firestoreId: null, // Default value for new users
  name: "",
  age: "",
  email: "",
  role: "",
  joinedDate: "",
});
const roles = ref(["Admin", "User", "Manager"]);

const filters = ref({
  name: "",
  age: "",
  email: "",
  role: "",
  joinedDate: "",
});

const pageSize = 5; // Number of users per page
const currentPage = ref(1);

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      user.value.imageUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }
};
const fetchUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    users.value = querySnapshot.docs.map((doc) => ({
      firestoreId: doc.id, // Firestore document ID
      ...doc.data(), // Include all fields from the document
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const openModal = (userToEdit = null) => {
  if (userToEdit) {
    user.value = { ...userToEdit };
    isEditing.value = true;
  } else {
    user.value = {
      firestoreId: null, // For new users, firestoreId will be null
      name: "",
      age: "",
      email: "",
      role: "",
      joinedDate: "",
    };
    isEditing.value = false;
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const submitForm = async () => {
  try {
    const userData = {
      name: user.value.name,
      age: user.value.age,
      email: user.value.email,
      role: user.value.role,
      joinedDate: user.value.joinedDate || new Date().toISOString(),
      imageUrl: user.value.imageUrl || "",
    };

    if (isEditing.value) {
      // Update the existing user document
      await updateDoc(doc(db, "users", user.value.firestoreId), userData);
      toast.success("User updated successfully!");
    } else {
      // Add a new user document
      await addDoc(collection(db, "users"), userData);
      toast.success("User added successfully!");
    }
    closeModal();
    fetchUsers();
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.error("Failed to save user.");
  }
};

const deleteUser = async (id) => {
  try {
    await deleteDoc(doc(db, "users", id));
    toast.success("User deleted successfully!");
    fetchUsers();
  } catch (error) {
    console.error("Error deleting user:", error);
    toast.error("Failed to delete user.");
  }
};

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return users.value.slice(start, start + pageSize);
});

const totalPages = computed(() => {
  return Math.ceil(users.value.length / pageSize);
});

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.container {
  background-color: #f9fafb;
  padding: 1.5rem;
}

h1 {
  color: #1f2937; /* Dark gray color */
  text-align: center;
}

.table-container {
  margin-top: 1rem;
}

table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

thead {
  background-color: #e5e7eb;
}

th,
td {
  padding: 16px 24px;
}

tr {
  transition: background-color 0.2s ease;
}

tr:hover {
  background-color: #f3f4f6;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 10px;
  margin-left: 5px;
  margin-top: 10px;
}

.btn-primary {
  background-color: #6b7280;
  color: white;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #4b5563;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #6b7280;
  transition: background-color 0.3s ease;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.btn-icon:hover {
  color: #4b5563;
}

.input-field {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem; /* Add margin bottom */
}
@media (min-width: 640px) {
  .input-field {
    margin-bottom: 0; /* Remove margin bottom on larger screens */
  }
}
/* Add top margin between form fields */
form > div {
  margin-top: 16px;
}

/* Ensure proper spacing for filters and table */
.mb-4 {
  margin-bottom: 1rem;
}

.flex-wrap {
  flex-wrap: wrap;
}

.gap-6 {
  gap: 1.5rem; /* Increased gap between filter inputs */
}

@media (min-width: 640px) {
  .sm\:w-1\/3 {
    width: 33.3333%;
  }
}

@media (min-width: 1024px) {
  .lg\:w-1\/4 {
    width: 25%;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.image-class {
  width: 70px;
  height: 60px;
  border-radius: 50%;
}
</style>
