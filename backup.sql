--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: techniques; Type: TABLE; Schema: public; Owner: loupe_admin
--

CREATE TABLE public.techniques (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    difficulty character varying(50),
    category character varying(100),
    video_url text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT techniques_difficulty_check CHECK (((difficulty)::text = ANY ((ARRAY['Beginner'::character varying, 'Intermediate'::character varying, 'Advanced'::character varying])::text[])))
);


ALTER TABLE public.techniques OWNER TO loupe_admin;

--
-- Name: techniques_id_seq; Type: SEQUENCE; Schema: public; Owner: loupe_admin
--

CREATE SEQUENCE public.techniques_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.techniques_id_seq OWNER TO loupe_admin;

--
-- Name: techniques_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: loupe_admin
--

ALTER SEQUENCE public.techniques_id_seq OWNED BY public.techniques.id;


--
-- Name: user_favorites; Type: TABLE; Schema: public; Owner: loupe_admin
--

CREATE TABLE public.user_favorites (
    id integer NOT NULL,
    user_id integer NOT NULL,
    technique_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_favorites OWNER TO loupe_admin;

--
-- Name: user_favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: loupe_admin
--

CREATE SEQUENCE public.user_favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_favorites_id_seq OWNER TO loupe_admin;

--
-- Name: user_favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: loupe_admin
--

ALTER SEQUENCE public.user_favorites_id_seq OWNED BY public.user_favorites.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: loupe_admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO loupe_admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: loupe_admin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO loupe_admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: loupe_admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: techniques id; Type: DEFAULT; Schema: public; Owner: loupe_admin
--

ALTER TABLE ONLY public.techniques ALTER COLUMN id SET DEFAULT nextval('public.techniques_id_seq'::regclass);


--
-- Name: user_favorites id; Type: DEFAULT; Schema: public; Owner: loupe_admin
--

ALTER TABLE ONLY public.user_favorites ALTER COLUMN id SET DEFAULT nextval('public.user_favorites_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: loupe_admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: techniques; Type: TABLE DATA; Schema: public; Owner: loupe_admin
--

COPY public.techniques (id, name, description, difficulty, category, video_url, created_at) FROM stdin;
2	Knit Stitch	The basic knitting stitch, forming the foundation of knitting.	Beginner	Knitting	https://s3.amazonaws.com/your-bucket/knit_stitch.mp4	2025-03-16 14:20:39.772335
3	Purl Stitch	The reverse of a knit stitch, used to create ribbing and texture.	Beginner	Knitting	https://s3.amazonaws.com/your-bucket/purl_stitch.mp4	2025-03-16 14:20:39.772335
4	Cable Twist	A technique used to create interwoven patterns resembling cables.	Intermediate	Knitting	https://s3.amazonaws.com/your-bucket/cable_twist.mp4	2025-03-16 14:20:39.772335
5	Slip Stitch	A method for skipping stitches to create unique textures or colorwork.	Intermediate	Knitting	https://s3.amazonaws.com/your-bucket/slip_stitch.mp4	2025-03-16 14:20:39.772335
6	Lace Knitting	An advanced technique involving yarn overs to create decorative holes.	Advanced	Knitting	https://s3.amazonaws.com/your-bucket/lace_knitting.mp4	2025-03-16 14:20:39.772335
7	Magic Loop	A method for knitting small diameter projects with a long circular needle.	Intermediate	Knitting	https://s3.amazonaws.com/your-bucket/magic_loop.mp4	2025-03-16 14:20:39.772335
8	I-Cord Bind Off	A stretchy, decorative bind-off technique creating a rounded edge.	Intermediate	Knitting	https://s3.amazonaws.com/your-bucket/i_cord_bind_off.mp4	2025-03-16 14:20:39.772335
9	German Short Rows	A short-row technique that prevents gaps and creates shaping.	Advanced	Knitting	https://s3.amazonaws.com/your-bucket/german_short_rows.mp4	2025-03-16 14:20:39.772335
10	Tubular Cast On	A seamless cast-on method ideal for ribbing and stretchy edges.	Advanced	Knitting	https://s3.amazonaws.com/your-bucket/tubular_cast_on.mp4	2025-03-16 14:20:39.772335
11	Brioche Stitch	A reversible, textured stitch pattern that creates a squishy fabric.	Advanced	Knitting	https://s3.amazonaws.com/your-bucket/brioche_stitch.mp4	2025-03-16 14:20:39.772335
\.


--
-- Data for Name: user_favorites; Type: TABLE DATA; Schema: public; Owner: loupe_admin
--

COPY public.user_favorites (id, user_id, technique_id, created_at) FROM stdin;
1	20	2	2025-03-16 16:15:08.853787
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: loupe_admin
--

COPY public.users (id, username, email, password, created_at) FROM stdin;
4	testuser	test@example.com	$2b$10$0XU2dUVNZH2UMRMgp/9TZePmfcn5B0cc3TBSNTGz48AtPDIhgwMd.	2025-03-15 09:57:51.45016
9	testuser1	test1@example.com	hashedpassword123	2025-03-15 17:17:13.996425
10	testuser2	test2@example.com	$2b$10$UVqq3i.kYErJqsuKGqczPeZ93IP4eG0vWYI0FjIEM7x7mtxSyn.hK	2025-03-15 17:20:05.696208
11	testuser3	test3@example.com	$2b$10$AdT/MG8g99CrGsApeXjli.6IlDIl/JzzleAUrdfDIscwxXlNNPIYe	2025-03-15 17:28:24.218442
14	admin	admin@example.com	$2b$10$DJKRSVJEVBmnDtTrK4WcIeSC4Dmw7irXba6xVUCJpM0nET3r.N.96	2025-03-15 19:50:11.882047
16	testuser4	testuser4@example.com	$2b$10$6QRy0E83v28WF7oRILJCe.Q/Y95vpShOcG7Wbaj.lwl/iZGC9zlQK	2025-03-15 20:35:22.260143
17	testuser5	test5@example.com	$2b$10$AFUWnq4pjnPTRoyVFaMGduQ5SmFFdpyqcW.bsO/yL04biY9g9Zgry	2025-03-15 20:49:26.47211
20	testuser23	test23@example.com	$2b$10$Ktpgj5x1QNJhaKlCzhPQ2eNEBZMzYqGaglTCfZR2bMOVbgLUwwDBO	2025-03-16 14:59:23.81296
\.


--
-- Name: techniques_id_seq; Type: SEQUENCE SET; Schema: public; Owner: loupe_admin
--

SELECT pg_catalog.setval('public.techniques_id_seq', 11, true);


--
-- Name: user_favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: loupe_admin
--

SELECT pg_catalog.setval('public.user_favorites_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: loupe_admin
--

SELECT pg_catalog.setval('public.users_id_seq', 20, true);


--
-- Name: techniques techniques_name_key; Type: CONSTRAINT; Schema: public; Owner: loupe_admin
--

ALTER TABLE ONLY public.techniques
    ADD CONSTRAINT techniques_name_key UNIQUE (name);


--
-- Name: techniques techniques_pkey; Type: CONSTRAINT; Schema: public; Owner: loupe_admin
--

ALTER TABLE ONLY public.techniques
    ADD CONSTRAINT techniques_pkey PRIMARY KEY (id);


--
-- Name: user_favorites user_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: loupe_admin
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_pkey PRIMARY KEY (id);


--
-- Name: user_favorites user_favorites_user_id_technique_id_key; Type: CONSTRAINT; Schema: public; Owner: loupe_admin
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_user_id_technique_id_key UNIQUE (user_id, technique_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: loupe_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: loupe_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: loupe_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: user_favorites user_favorites_technique_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: loupe_admin
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_technique_id_fkey FOREIGN KEY (technique_id) REFERENCES public.techniques(id) ON DELETE CASCADE;


--
-- Name: user_favorites user_favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: loupe_admin
--

ALTER TABLE ONLY public.user_favorites
    ADD CONSTRAINT user_favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

