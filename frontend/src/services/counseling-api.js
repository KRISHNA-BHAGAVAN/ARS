// API service for counseling notes
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const counselingApi = {
  // Get counseling notes for a student
  getCounselingNotes: async (regNo) => {
    try {
      const response = await axios.get(`${API_URL}/counseling/student/${regNo}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching counseling notes:', error);
      return [];
    }
  },
  
  // Add a new counseling note
  addCounselingNote: async (regNo, noteData) => {
    try {
      const response = await axios.post(`${API_URL}/counseling/student/${regNo}`, noteData);
      return response.data;
    } catch (error) {
      console.error('Error adding counseling note:', error);
      throw error;
    }
  },
  
  // Update a counseling note
  updateCounselingNote: async (id, noteData) => {
    try {
      const response = await axios.put(`${API_URL}/counseling/${id}`, noteData);
      return response.data;
    } catch (error) {
      console.error('Error updating counseling note:', error);
      throw error;
    }
  },
  
  // Delete a counseling note
  deleteCounselingNote: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/counseling/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting counseling note:', error);
      throw error;
    }
  }
};