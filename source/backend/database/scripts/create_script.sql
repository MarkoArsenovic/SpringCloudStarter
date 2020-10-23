--
-- PostgreSQL database dump
--

-- Dumped from database version 10.8 (Ubuntu 10.8-1.pgdg18.04+1)
-- Dumped by pg_dump version 11.3 (Ubuntu 11.3-1.pgdg18.04+1)

-- Started on 2020-10-02 16:25:34 CEST

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

SET default_with_oids = false;

--
-- TOC entry 197 (class 1259 OID 25888)
-- Name: tblpermissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tblpermissions (
    permissionid bigint NOT NULL,
    candelete boolean,
    canread boolean,
    canupdate boolean,
    canwrite boolean,
    roleid bigint,
    serviceid bigint
);


ALTER TABLE public.tblpermissions OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 25886)
-- Name: tblpermissions_permissionid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tblpermissions_permissionid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tblpermissions_permissionid_seq OWNER TO postgres;

--
-- TOC entry 2971 (class 0 OID 0)
-- Dependencies: 196
-- Name: tblpermissions_permissionid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tblpermissions_permissionid_seq OWNED BY public.tblpermissions.permissionid;


--
-- TOC entry 199 (class 1259 OID 25896)
-- Name: tblroles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tblroles (
    roleid bigint NOT NULL,
    description character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE public.tblroles OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 25894)
-- Name: tblroles_roleid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tblroles_roleid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tblroles_roleid_seq OWNER TO postgres;

--
-- TOC entry 2972 (class 0 OID 0)
-- Dependencies: 198
-- Name: tblroles_roleid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tblroles_roleid_seq OWNED BY public.tblroles.roleid;


--
-- TOC entry 201 (class 1259 OID 25907)
-- Name: tblservices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tblservices (
    serviceid bigint NOT NULL,
    description character varying(255),
    displayname character varying(255) NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.tblservices OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 25905)
-- Name: tblservices_serviceid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tblservices_serviceid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tblservices_serviceid_seq OWNER TO postgres;

--
-- TOC entry 2973 (class 0 OID 0)
-- Dependencies: 200
-- Name: tblservices_serviceid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tblservices_serviceid_seq OWNED BY public.tblservices.serviceid;


--
-- TOC entry 203 (class 1259 OID 25918)
-- Name: tbltokenreset; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbltokenreset (
    tokenresetid bigint NOT NULL,
    expirydate timestamp without time zone,
    resettoken character varying(255),
    userid bigint NOT NULL
);


ALTER TABLE public.tbltokenreset OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 25916)
-- Name: tbltokenreset_tokenresetid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbltokenreset_tokenresetid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbltokenreset_tokenresetid_seq OWNER TO postgres;

--
-- TOC entry 2974 (class 0 OID 0)
-- Dependencies: 202
-- Name: tbltokenreset_tokenresetid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbltokenreset_tokenresetid_seq OWNED BY public.tbltokenreset.tokenresetid;


--
-- TOC entry 204 (class 1259 OID 25924)
-- Name: tbluserroles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbluserroles (
    userid bigint NOT NULL,
    roleid bigint NOT NULL
);


ALTER TABLE public.tbluserroles OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 25929)
-- Name: tblusers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tblusers (
    userid bigint NOT NULL,
    email character varying(255) NOT NULL,
    enabled boolean NOT NULL,
    lastname character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    username character varying(255) NOT NULL
);


ALTER TABLE public.tblusers OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 25927)
-- Name: tblusers_userid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tblusers_userid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tblusers_userid_seq OWNER TO postgres;

--
-- TOC entry 2975 (class 0 OID 0)
-- Dependencies: 205
-- Name: tblusers_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tblusers_userid_seq OWNED BY public.tblusers.userid;


--
-- TOC entry 2817 (class 2604 OID 25891)
-- Name: tblpermissions permissionid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tblpermissions ALTER COLUMN permissionid SET DEFAULT nextval('public.tblpermissions_permissionid_seq'::regclass);


--
-- TOC entry 2818 (class 2604 OID 25899)
-- Name: tblroles roleid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tblroles ALTER COLUMN roleid SET DEFAULT nextval('public.tblroles_roleid_seq'::regclass);


--
-- TOC entry 2819 (class 2604 OID 25910)
-- Name: tblservices serviceid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tblservices ALTER COLUMN serviceid SET DEFAULT nextval('public.tblservices_serviceid_seq'::regclass);


--
-- TOC entry 2820 (class 2604 OID 25921)
-- Name: tbltokenreset tokenresetid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbltokenreset ALTER COLUMN tokenresetid SET DEFAULT nextval('public.tbltokenreset_tokenresetid_seq'::regclass);


--
-- TOC entry 2821 (class 2604 OID 25932)
-- Name: tblusers userid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tblusers ALTER COLUMN userid SET DEFAULT nextval('public.tblusers_userid_seq'::regclass);


--
-- TOC entry 2823 (class 2606 OID 25893)
-- Name: tblpermissions tblpermissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tblpermissions
    ADD CONSTRAINT tblpermissions_pkey PRIMARY KEY (permissionid);


--
-- TOC entry 2825 (class 2606 OID 25904)
-- Name: tblroles tblroles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tblroles
    ADD CONSTRAINT tblroles_pkey PRIMARY KEY (roleid);


--
-- TOC entry 2829 (class 2606 OID 25915)
-- Name: tblservices tblservices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tblservices
    ADD CONSTRAINT tblservices_pkey PRIMARY KEY (serviceid);


--
-- TOC entry 2833 (class 2606 OID 25923)
-- Name: tbltokenreset tbltokenreset_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbltokenreset
    ADD CONSTRAINT tbltokenreset_pkey PRIMARY KEY (tokenresetid);


--
-- TOC entry 2835 (class 2606 OID 25937)
-- Name: tblusers tblusers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tblusers
    ADD CONSTRAINT tblusers_pkey PRIMARY KEY (userid);


--
-- TOC entry 2831 (class 2606 OID 25941)
-- Name: tblservices uk_2womh8nf3bse3umi2e48bp135; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tblservices
    ADD CONSTRAINT uk_2womh8nf3bse3umi2e48bp135 UNIQUE (name);


--
-- TOC entry 2837 (class 2606 OID 25945)
-- Name: tblusers uk_740om0xw5jo65vg6iwg45m11n; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tblusers
    ADD CONSTRAINT uk_740om0xw5jo65vg6iwg45m11n UNIQUE (username);


--
-- TOC entry 2839 (class 2606 OID 25943)
-- Name: tblusers uk_hd86n9dhdujmi2kttn7e7dfoo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tblusers
    ADD CONSTRAINT uk_hd86n9dhdujmi2kttn7e7dfoo UNIQUE (email);


--
-- TOC entry 2827 (class 2606 OID 25939)
-- Name: tblroles uk_othecdgxgrardwp5xujm697xm; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tblroles
    ADD CONSTRAINT uk_othecdgxgrardwp5xujm697xm UNIQUE (name);


--
-- TOC entry 2844 (class 2606 OID 25966)
-- Name: tbluserroles fkeeii8gtbyhs3llie1l4pku0xw; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbluserroles
    ADD CONSTRAINT fkeeii8gtbyhs3llie1l4pku0xw FOREIGN KEY (userid) REFERENCES public.tblusers(userid);


--
-- TOC entry 2840 (class 2606 OID 25946)
-- Name: tblpermissions fkf4u89tvkvnjb0aoxy1xr4c6nr; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tblpermissions
    ADD CONSTRAINT fkf4u89tvkvnjb0aoxy1xr4c6nr FOREIGN KEY (roleid) REFERENCES public.tblroles(roleid);


--
-- TOC entry 2842 (class 2606 OID 25956)
-- Name: tbltokenreset fkgkwbbko5eywep2s946buqc1a8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbltokenreset
    ADD CONSTRAINT fkgkwbbko5eywep2s946buqc1a8 FOREIGN KEY (userid) REFERENCES public.tblusers(userid);


--
-- TOC entry 2841 (class 2606 OID 25951)
-- Name: tblpermissions fkpfpechqsc1rwh3fq6ob9dd2yk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tblpermissions
    ADD CONSTRAINT fkpfpechqsc1rwh3fq6ob9dd2yk FOREIGN KEY (serviceid) REFERENCES public.tblservices(serviceid);


--
-- TOC entry 2843 (class 2606 OID 25961)
-- Name: tbluserroles fkrlr9xyrok6xd1x95s97lo9jhm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbluserroles
    ADD CONSTRAINT fkrlr9xyrok6xd1x95s97lo9jhm FOREIGN KEY (roleid) REFERENCES public.tblroles(roleid);


-- Completed on 2020-10-02 16:25:34 CEST

--
-- PostgreSQL database dump complete
--

