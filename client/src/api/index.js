import axios from "axios";

/* ✅ YOUR RENDER BACKEND URL */
const API = axios.create({
  baseURL: "https://project-management-app-kfhs.onrender.com/api",
});

/* ---------------- AUTH ---------------- */

export const signIn = ({ email, password }) =>
  API.post("/auth/signin", { email, password });

export const signUp = ({ name, email, password }) =>
  API.post("/auth/signup", { name, email, password });

export const googleSignIn = ({ name, email, img }) =>
  API.post("/auth/google", { name, email, img });

export const findUserByEmail = (email) =>
  API.get(`/auth/findbyemail?email=${email}`);

export const generateOtp = (email, name, reason) =>
  API.get(
    `/auth/generateotp?email=${email}&name=${name}&reason=${reason}`
  );

export const verifyOtp = (otp) =>
  API.get(`/auth/verifyotp?code=${otp}`);

export const resetPassword = (email, password) =>
  API.put("/auth/forgetpassword", { email, password });

/* ---------------- USERS ---------------- */

export const getUsers = (token) =>
  API.get("/users/find", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const searchUsers = (search, token) =>
  API.get(`/users/search/${search}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const notifications = (token) =>
  API.get("/users/notifications", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getProjects = (token) =>
  API.get("/users/projects", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const userWorks = (token) =>
  API.get("/users/works", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const userTasks = (token) =>
  API.get("/users/tasks", {
    headers: { Authorization: `Bearer ${token}` },
  });

/* ---------------- PROJECTS ---------------- */

export const createProject = (project, token) =>
  API.post("/project", project, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getProjectDetails = (id, token) =>
  API.get(`/project/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const inviteProjectMembers = (id, members, token) =>
  API.post(`/project/invite/${id}`, members, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addWorks = (id, works, token) =>
  API.post(`/project/works/${id}`, works, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getWorks = (id, token) =>
  API.get(`/project/works/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const verifyProjectInvite = (
  code,
  projectid,
  userid,
  access,
  role
) =>
  API.get(
    `/project/invite/${code}?projectid=${projectid}&userid=${userid}&access=${access}&role=${role}`
  );

export const updateProject = (id, project, token) =>
  API.patch(`/project/${id}`, project, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteProject = (id, token) =>
  API.delete(`/project/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateMembers = (id, members, token) =>
  API.patch(`/project/member/${id}`, members, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const removeMembers = (id, members, token) =>
  API.patch(`/project/member/remove/${id}`, members, {
    headers: { Authorization: `Bearer ${token}` },
  });

/* ---------------- TEAMS ---------------- */

export const createTeam = (team, token) =>
  API.post("/team", team, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getTeams = (id, token) =>
  API.get(`/team/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const inviteTeamMembers = (id, members, token) =>
  API.post(`/team/invite/${id}`, members, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addTeamProject = (id, project, token) =>
  API.post(`/team/addProject/${id}`, project, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const verifyTeamInvite = (
  code,
  teamid,
  userid,
  access,
  role
) =>
  API.get(
    `/team/invite/${code}?teamid=${teamid}&userid=${userid}&access=${access}&role=${role}`
  );

export const updateTeam = (id, team, token) =>
  API.patch(`/team/${id}`, team, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteTeam = (id, token) =>
  API.delete(`/team/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateTeamMembers = (id, members, token) =>
  API.patch(`/team/member/${id}`, members, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const removeTeamMembers = (id, members, token) =>
  API.patch(`/team/member/remove/${id}`, members, {
    headers: { Authorization: `Bearer ${token}` },
  });
