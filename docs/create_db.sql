--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3
-- Dumped by pg_dump version 14.2

-- Started on 2022-05-31 22:24:09

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
-- TOC entry 209 (class 1259 OID 16387)
-- Name: boxes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.boxes (
    _id uuid NOT NULL,
    title text,
    password text NOT NULL,
    notify_email character varying(320)
);


ALTER TABLE public.boxes OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 16395)
-- Name: questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.questions (
    _id uuid NOT NULL,
    question text NOT NULL,
    box_id uuid NOT NULL,
    notify_email character varying(320)
);


ALTER TABLE public.questions OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 16407)
-- Name: responses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.responses (
    _id uuid NOT NULL,
    response text NOT NULL,
    notify_email character varying(320),
    response_id uuid,
    question_id uuid,
    CONSTRAINT one_is_not_null CHECK (((response_id IS NOT NULL) OR (question_id IS NOT NULL))),
    CONSTRAINT one_is_null CHECK (((response_id IS NULL) OR (question_id IS NULL)))
);


ALTER TABLE public.responses OWNER TO postgres;

--
-- TOC entry 3189 (class 2606 OID 16391)
-- Name: boxes Boxes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boxes
    ADD CONSTRAINT "Boxes_pkey" PRIMARY KEY (_id);


--
-- TOC entry 3193 (class 2606 OID 16401)
-- Name: questions Questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT "Questions_pkey" PRIMARY KEY (_id);


--
-- TOC entry 3199 (class 2606 OID 16441)
-- Name: responses response_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.responses
    ADD CONSTRAINT response_id PRIMARY KEY (_id);


--
-- TOC entry 3195 (class 2606 OID 16447)
-- Name: questions unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT "unique" UNIQUE (_id);


--
-- TOC entry 3191 (class 2606 OID 16427)
-- Name: boxes unique_boxid; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boxes
    ADD CONSTRAINT unique_boxid UNIQUE (_id);


--
-- TOC entry 3201 (class 2606 OID 16445)
-- Name: responses unique_question; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.responses
    ADD CONSTRAINT unique_question UNIQUE (question_id);


--
-- TOC entry 3203 (class 2606 OID 16420)
-- Name: responses unique_rid; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.responses
    ADD CONSTRAINT unique_rid UNIQUE (_id);


--
-- TOC entry 3196 (class 1259 OID 16458)
-- Name: fki_FK_questions_responses; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_FK_questions_responses" ON public.responses USING btree (question_id);


--
-- TOC entry 3197 (class 1259 OID 16464)
-- Name: fki_FK_responses_responses; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "fki_FK_responses_responses" ON public.responses USING btree (response_id);


--
-- TOC entry 3204 (class 2606 OID 16448)
-- Name: questions FK_questions_boxes; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT "FK_questions_boxes" FOREIGN KEY (box_id) REFERENCES public.boxes(_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3205 (class 2606 OID 16453)
-- Name: responses FK_questions_responses; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.responses
    ADD CONSTRAINT "FK_questions_responses" FOREIGN KEY (question_id) REFERENCES public.questions(_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3206 (class 2606 OID 16459)
-- Name: responses FK_responses_responses; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.responses
    ADD CONSTRAINT "FK_responses_responses" FOREIGN KEY (response_id) REFERENCES public.responses(_id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2022-05-31 22:24:11

--
-- PostgreSQL database dump complete
--

