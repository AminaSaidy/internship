--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.8 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schools (id, number, name, classes_amount, teachers_amount, status) FROM stdin;
1	103	MySchool #103	25	40	t
2	190	notSchool #190	78	79	t
3	222	notSchool #222	32	44	f
4	22	notSchool #22	32	44	f
5	118	notSchool #118	14	29	t
6	118	notSchool #118	14	29	t
7	202	notSchool #202	55	100	f
\.


--
-- Data for Name: classes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.classes (id, school_id, name, year) FROM stdin;
1	1	10A	2025
2	1	10A	2025
3	5	5B	2024
4	3	5B	2025
5	3	5B	2025
6	3	5B	2025
\.


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subjects (id, name, description) FROM stdin;
1	Математика	Основы алгебры и геометрии
2	English	foreign language level B2
3	Chemistry	Overview of organic checmistry
4	History	World history X-XV centuries
5	Informatics	introduction to IT
\.


--
-- Data for Name: class_subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.class_subjects (class_id, subject_id) FROM stdin;
3	3
2	3
2	1
1	1
1	2
3	2
1	3
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teachers (id, name, birth_date, phone, email, hired_at) FROM stdin;
1	Анна Иванова	1985-09-20	+998 91 456 78 90	anna.ivanova@example.com	2020-08-15
2	Martha Lucker	1970-01-25	+998 91 222 78 91	martha.lucker@example.com	2018-05-11
3	Nathon Cracker	1982-10-11	+998 91 209 18 21	nathon.cracker@example.com	2021-04-15
4	Аnna Annovna	1989-09-20	+998 90 456 78 90	anna.annovna@example.com	2017-08-15
\.


--
-- Data for Name: class_teachers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.class_teachers (class_id, teacher_id) FROM stdin;
2	1
1	3
2	3
3	3
1	2
2	2
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, class_id, name, birth_date, gender, enrolled_at) FROM stdin;
4	2	Anna Quineston	2013-12-01	F	2022-09-03 08:00:00
5	1	Alex Nielson	2010-05-15	M	2024-09-01 08:00:00
6	2	Jack Bollock	2015-01-11	M	2023-09-01 08:00:00
7	1	Иван Петров	2010-03-15	M	2024-09-01 08:00:00
\.


--
-- Name: classes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.classes_id_seq', 6, true);


--
-- Name: schools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schools_id_seq', 7, true);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_id_seq', 7, true);


--
-- Name: subjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subjects_id_seq', 5, true);


--
-- Name: teachers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teachers_id_seq', 4, true);


--
-- PostgreSQL database dump complete
--

