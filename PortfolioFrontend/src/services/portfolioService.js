import apiClient from './api.js';

export const portfolioService = {
  // --- Profile & Hero ---
  async getPublicProfile() {
    return await apiClient.get('/profile');
  },
  async getAdminProfile() {
    return await apiClient.get('/profile/admin');
  },
  async updateProfile(profileData) {
    return await apiClient.put('/profile/admin', profileData);
  },

  // --- Skills ---
  async getPublicSkills() {
    return await apiClient.get('/skills');
  },
  async getAdminSkills(params = {}) {
    return await apiClient.get('/skills/admin', { params });
  },
  async createSkill(skillData) {
    return await apiClient.post('/skills/admin', skillData);
  },
  async updateSkill(id, skillData) {
    return await apiClient.put(`/skills/admin/${id}`, skillData);
  },
  async deleteSkill(id) {
    return await apiClient.delete(`/skills/admin/${id}`);
  },

  // --- Experience ---
  async getPublicExperience() {
    return await apiClient.get('/experience');
  },
  async getAdminExperience() {
    return await apiClient.get('/experience/admin');
  },
  async createExperience(experienceData) {
    return await apiClient.post('/experience/admin', experienceData);
  },
  async updateExperience(id, experienceData) {
    return await apiClient.put(`/experience/admin/${id}`, experienceData);
  },
  async deleteExperience(id) {
    return await apiClient.delete(`/experience/admin/${id}`);
  },

  // --- Projects ---
  async getPublicProjects(params = {}) {
    return await apiClient.get('/projects', { params });
  },
  async getProjectBySlug(slug) {
    return await apiClient.get(`/projects/detail/${slug}`);
  },
  async getAdminProjects(params = {}) {
    return await apiClient.get('/projects/admin', { params });
  },
  async createProject(projectData) {
    return await apiClient.post('/projects/admin', projectData);
  },
  async updateProject(id, projectData) {
    return await apiClient.put(`/projects/admin/${id}`, projectData);
  },
  async deleteProject(id) {
    return await apiClient.delete(`/projects/admin/${id}`);
  },

  // --- Services ---
  async getPublicServices() {
    return await apiClient.get('/services');
  },
  async getAdminServices() {
    return await apiClient.get('/services/admin');
  },
  async createService(serviceData) {
    return await apiClient.post('/services/admin', serviceData);
  },
  async updateService(id, serviceData) {
    return await apiClient.put(`/services/admin/${id}`, serviceData);
  },
  async deleteService(id) {
    return await apiClient.delete(`/services/admin/${id}`);
  },

  // --- Education ---
  async getPublicEducation() {
    return await apiClient.get('/education');
  },
  async getAdminEducation() {
    return await apiClient.get('/education/admin');
  },
  async createEducation(educationData) {
    return await apiClient.post('/education/admin', educationData);
  },
  async updateEducation(id, educationData) {
    return await apiClient.put(`/education/admin/${id}`, educationData);
  },
  async deleteEducation(id) {
    return await apiClient.delete(`/education/admin/${id}`);
  },

  // --- Dashboard ---
  async getDashboardStats() {
    return await apiClient.get('/dashboard/stats');
  },
};

export default portfolioService;
