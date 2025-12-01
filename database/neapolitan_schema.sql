--
-- PostgreSQL database dump
--

\restrict mDSS0fkEM4iWvqjMKuyuCmMI8AXH4kYfpp5jC4obXbDc4pzfb5gqdEHhFfhmvqP

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-12-01 09:08:41

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- TOC entry 248 (class 1259 OID 16914)
-- Name: bank_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bank_metrics (
    collateral_id integer,
    start_date date,
    end_date date,
    advance_rate numeric(11,8),
    valuation numeric(11,8),
    bank_metrics_id integer NOT NULL
);


--
-- TOC entry 249 (class 1259 OID 16929)
-- Name: bank_metrics_bank_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bank_metrics_bank_metrics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4445 (class 0 OID 0)
-- Dependencies: 249
-- Name: bank_metrics_bank_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bank_metrics_bank_metrics_id_seq OWNED BY public.bank_metrics.bank_metrics_id;


--
-- TOC entry 217 (class 1259 OID 16643)
-- Name: borrowers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.borrowers (
    borrower_id integer NOT NULL,
    legal_name text NOT NULL,
    short_name text,
    corporate_hq_id integer,
    revenue_geography_id integer,
    naics_subsector_id integer,
    is_public boolean,
    ticker_symbol text
);


--
-- TOC entry 218 (class 1259 OID 16648)
-- Name: borrowers_borrower_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.borrowers_borrower_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4446 (class 0 OID 0)
-- Dependencies: 218
-- Name: borrowers_borrower_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.borrowers_borrower_id_seq OWNED BY public.borrowers.borrower_id;


--
-- TOC entry 219 (class 1259 OID 16649)
-- Name: collateral; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collateral (
    debt_facility_id integer NOT NULL,
    inclusion_date date,
    removed_date date,
    collateral_id integer NOT NULL,
    tranche_id integer NOT NULL,
    loan_approval_id integer
);


--
-- TOC entry 220 (class 1259 OID 16652)
-- Name: collateral_balance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collateral_balance (
    collateral_balance_id integer NOT NULL,
    collateral_id integer NOT NULL,
    start_date date,
    end_date date,
    outstanding_amount numeric(12,2),
    commitment_amount numeric(12,2)
);


--
-- TOC entry 221 (class 1259 OID 16655)
-- Name: collateral_balance_collateral_balance_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.collateral_balance_collateral_balance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4447 (class 0 OID 0)
-- Dependencies: 221
-- Name: collateral_balance_collateral_balance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.collateral_balance_collateral_balance_id_seq OWNED BY public.collateral_balance.collateral_balance_id;


--
-- TOC entry 222 (class 1259 OID 16656)
-- Name: collateral_collateral_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.collateral_collateral_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4448 (class 0 OID 0)
-- Dependencies: 222
-- Name: collateral_collateral_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.collateral_collateral_id_seq OWNED BY public.collateral.collateral_id;


--
-- TOC entry 223 (class 1259 OID 16657)
-- Name: debt_facilities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.debt_facilities (
    debt_facility_name text NOT NULL,
    portfolio_id integer NOT NULL,
    lender_id integer NOT NULL,
    debt_facility_id integer NOT NULL
);


--
-- TOC entry 224 (class 1259 OID 16662)
-- Name: debt_facilities_debt_facility_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.debt_facilities_debt_facility_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4449 (class 0 OID 0)
-- Dependencies: 224
-- Name: debt_facilities_debt_facility_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.debt_facilities_debt_facility_id_seq OWNED BY public.debt_facilities.debt_facility_id;


--
-- TOC entry 225 (class 1259 OID 16663)
-- Name: debt_facility_balances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.debt_facility_balances (
    debt_facility_balance_id smallint NOT NULL,
    debt_facility_id integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    outstanding_amount numeric(12,2) NOT NULL
);


--
-- TOC entry 226 (class 1259 OID 16666)
-- Name: debt_facility_balance_debt_facility_balance_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.debt_facility_balance_debt_facility_balance_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4450 (class 0 OID 0)
-- Dependencies: 226
-- Name: debt_facility_balance_debt_facility_balance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.debt_facility_balance_debt_facility_balance_id_seq OWNED BY public.debt_facility_balances.debt_facility_balance_id;


--
-- TOC entry 227 (class 1259 OID 16667)
-- Name: debt_facility_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.debt_facility_options (
    debt_facility_id integer NOT NULL,
    start_date date NOT NULL,
    is_overall_rate boolean NOT NULL,
    overall_rate numeric(11,8),
    is_asset_by_asset_advance boolean NOT NULL,
    is_first_lien_advance_rate boolean NOT NULL,
    first_lien_advance_rate numeric(11,8),
    is_second_lien_advance_rate boolean NOT NULL,
    second_lien_advance_rate numeric(11,8),
    is_mezzanine_advance_rate boolean NOT NULL,
    mezzanine_advance_rate numeric(11,8),
    is_minimum_equity boolean NOT NULL,
    minimum_equity_amount numeric(12,2),
    overall_commitment_amount numeric(12,2) NOT NULL,
    debt_facilities_options_id integer NOT NULL,
    end_date date NOT NULL
);


--
-- TOC entry 228 (class 1259 OID 16670)
-- Name: debt_facility_options_debt_facilities_options_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.debt_facility_options_debt_facilities_options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4451 (class 0 OID 0)
-- Dependencies: 228
-- Name: debt_facility_options_debt_facilities_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.debt_facility_options_debt_facilities_options_id_seq OWNED BY public.debt_facility_options.debt_facilities_options_id;


--
-- TOC entry 229 (class 1259 OID 16671)
-- Name: lenders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lenders (
    lender_name text NOT NULL,
    lender_id integer NOT NULL
);


--
-- TOC entry 230 (class 1259 OID 16676)
-- Name: lenders_lender_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lenders_lender_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4452 (class 0 OID 0)
-- Dependencies: 230
-- Name: lenders_lender_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lenders_lender_id_seq OWNED BY public.lenders.lender_id;


--
-- TOC entry 231 (class 1259 OID 16677)
-- Name: loan_agreements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.loan_agreements (
    loan_agreement_id integer NOT NULL,
    borrower_id integer NOT NULL,
    loan_agreement_date date,
    loan_agreement_name text
);


--
-- TOC entry 247 (class 1259 OID 16873)
-- Name: loan_approvals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.loan_approvals (
    loan_approval_id integer NOT NULL,
    tranche_id integer NOT NULL,
    debt_facility_id integer NOT NULL,
    approval_date date NOT NULL,
    approved_amount numeric(12,2),
    approved_ebitda numeric(12,2),
    approved_leverage numeric(11,8),
    approved_int_coverage numeric(11,8),
    approved_net_leverage numeric(11,8),
    approved_advance_rate numeric(11,8),
    loan_approval_name text,
    approval_expiration date,
    approved_valuation numeric(11,8)
);


--
-- TOC entry 246 (class 1259 OID 16872)
-- Name: loan_approvals_loan_approval_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.loan_approvals_loan_approval_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4453 (class 0 OID 0)
-- Dependencies: 246
-- Name: loan_approvals_loan_approval_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.loan_approvals_loan_approval_id_seq OWNED BY public.loan_approvals.loan_approval_id;


--
-- TOC entry 232 (class 1259 OID 16680)
-- Name: loan_facility_loan_facility_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.loan_facility_loan_facility_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4454 (class 0 OID 0)
-- Dependencies: 232
-- Name: loan_facility_loan_facility_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.loan_facility_loan_facility_id_seq OWNED BY public.loan_agreements.loan_agreement_id;


--
-- TOC entry 233 (class 1259 OID 16681)
-- Name: loan_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.loan_metrics (
    loan_metrics_id integer NOT NULL,
    tranche_id integer NOT NULL,
    start_date date,
    is_cov_default boolean,
    is_payment_default boolean,
    leverage_ratio numeric(11,8),
    net_leverage_ratio numeric(11,8),
    int_coverage_ratio numeric(11,8),
    ebitda numeric(12,2),
    end_date date,
    internal_val numeric(11,8)
);


--
-- TOC entry 234 (class 1259 OID 16684)
-- Name: loan_metrics_loan_metrics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.loan_metrics_loan_metrics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4455 (class 0 OID 0)
-- Dependencies: 234
-- Name: loan_metrics_loan_metrics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.loan_metrics_loan_metrics_id_seq OWNED BY public.loan_metrics.loan_metrics_id;


--
-- TOC entry 235 (class 1259 OID 16685)
-- Name: loan_tranches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.loan_tranches (
    tranche_id integer NOT NULL,
    loan_agreement_id integer NOT NULL,
    tranche_type text,
    lien_type text,
    maturity_date date,
    tranche_name text,
    start_date date
);


--
-- TOC entry 236 (class 1259 OID 16690)
-- Name: loan_tranches_tranche_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.loan_tranches_tranche_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4456 (class 0 OID 0)
-- Dependencies: 236
-- Name: loan_tranches_tranche_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.loan_tranches_tranche_id_seq OWNED BY public.loan_tranches.tranche_id;


--
-- TOC entry 243 (class 1259 OID 16831)
-- Name: naics_subsectors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.naics_subsectors (
    naics_subsector_id integer NOT NULL,
    naics_subsector_name text
);


--
-- TOC entry 237 (class 1259 OID 16691)
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    payments_id integer NOT NULL,
    collateral_id integer NOT NULL,
    payment_date date,
    principal_received numeric(12,2),
    interest_received numeric(12,2)
);


--
-- TOC entry 238 (class 1259 OID 16694)
-- Name: payments_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payments_payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4457 (class 0 OID 0)
-- Dependencies: 238
-- Name: payments_payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payments_payments_id_seq OWNED BY public.payments.payments_id;


--
-- TOC entry 239 (class 1259 OID 16695)
-- Name: portfolios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.portfolios (
    portfolio_name text NOT NULL,
    portfolio_id integer NOT NULL
);


--
-- TOC entry 240 (class 1259 OID 16700)
-- Name: portfolios_portfolio_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.portfolios_portfolio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4458 (class 0 OID 0)
-- Dependencies: 240
-- Name: portfolios_portfolio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.portfolios_portfolio_id_seq OWNED BY public.portfolios.portfolio_id;


--
-- TOC entry 241 (class 1259 OID 16701)
-- Name: rate_data; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rate_data (
    rate_data_id integer NOT NULL,
    tranche_id integer NOT NULL,
    is_fixed boolean,
    fixed_rate numeric(11,8),
    spread numeric(11,8),
    floor numeric(11,8),
    start_date date,
    end_date date,
    has_floor boolean,
    reference_rate text
);


--
-- TOC entry 242 (class 1259 OID 16706)
-- Name: rate_date_rate_data_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rate_date_rate_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4459 (class 0 OID 0)
-- Dependencies: 242
-- Name: rate_date_rate_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rate_date_rate_data_id_seq OWNED BY public.rate_data.rate_data_id;


--
-- TOC entry 244 (class 1259 OID 16839)
-- Name: regions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.regions (
    region_name text NOT NULL,
    region_id integer NOT NULL
);


--
-- TOC entry 245 (class 1259 OID 16846)
-- Name: regions_region_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.regions_region_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4460 (class 0 OID 0)
-- Dependencies: 245
-- Name: regions_region_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.regions_region_id_seq OWNED BY public.regions.region_id;


--
-- TOC entry 4241 (class 2604 OID 16930)
-- Name: bank_metrics bank_metrics_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_metrics ALTER COLUMN bank_metrics_id SET DEFAULT nextval('public.bank_metrics_bank_metrics_id_seq'::regclass);


--
-- TOC entry 4226 (class 2604 OID 16707)
-- Name: borrowers borrower_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.borrowers ALTER COLUMN borrower_id SET DEFAULT nextval('public.borrowers_borrower_id_seq'::regclass);


--
-- TOC entry 4227 (class 2604 OID 16708)
-- Name: collateral collateral_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collateral ALTER COLUMN collateral_id SET DEFAULT nextval('public.collateral_collateral_id_seq'::regclass);


--
-- TOC entry 4228 (class 2604 OID 16709)
-- Name: collateral_balance collateral_balance_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collateral_balance ALTER COLUMN collateral_balance_id SET DEFAULT nextval('public.collateral_balance_collateral_balance_id_seq'::regclass);


--
-- TOC entry 4229 (class 2604 OID 16710)
-- Name: debt_facilities debt_facility_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.debt_facilities ALTER COLUMN debt_facility_id SET DEFAULT nextval('public.debt_facilities_debt_facility_id_seq'::regclass);


--
-- TOC entry 4230 (class 2604 OID 16711)
-- Name: debt_facility_balances debt_facility_balance_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.debt_facility_balances ALTER COLUMN debt_facility_balance_id SET DEFAULT nextval('public.debt_facility_balance_debt_facility_balance_id_seq'::regclass);


--
-- TOC entry 4231 (class 2604 OID 16712)
-- Name: debt_facility_options debt_facilities_options_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.debt_facility_options ALTER COLUMN debt_facilities_options_id SET DEFAULT nextval('public.debt_facility_options_debt_facilities_options_id_seq'::regclass);


--
-- TOC entry 4232 (class 2604 OID 16713)
-- Name: lenders lender_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lenders ALTER COLUMN lender_id SET DEFAULT nextval('public.lenders_lender_id_seq'::regclass);


--
-- TOC entry 4233 (class 2604 OID 16714)
-- Name: loan_agreements loan_agreement_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loan_agreements ALTER COLUMN loan_agreement_id SET DEFAULT nextval('public.loan_facility_loan_facility_id_seq'::regclass);


--
-- TOC entry 4240 (class 2604 OID 16876)
-- Name: loan_approvals loan_approval_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loan_approvals ALTER COLUMN loan_approval_id SET DEFAULT nextval('public.loan_approvals_loan_approval_id_seq'::regclass);


--
-- TOC entry 4234 (class 2604 OID 16715)
-- Name: loan_metrics loan_metrics_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loan_metrics ALTER COLUMN loan_metrics_id SET DEFAULT nextval('public.loan_metrics_loan_metrics_id_seq'::regclass);


--
-- TOC entry 4235 (class 2604 OID 16716)
-- Name: loan_tranches tranche_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loan_tranches ALTER COLUMN tranche_id SET DEFAULT nextval('public.loan_tranches_tranche_id_seq'::regclass);


--
-- TOC entry 4236 (class 2604 OID 16717)
-- Name: payments payments_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments ALTER COLUMN payments_id SET DEFAULT nextval('public.payments_payments_id_seq'::regclass);


--
-- TOC entry 4237 (class 2604 OID 16718)
-- Name: portfolios portfolio_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolios ALTER COLUMN portfolio_id SET DEFAULT nextval('public.portfolios_portfolio_id_seq'::regclass);


--
-- TOC entry 4238 (class 2604 OID 16719)
-- Name: rate_data rate_data_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_data ALTER COLUMN rate_data_id SET DEFAULT nextval('public.rate_date_rate_data_id_seq'::regclass);


--
-- TOC entry 4239 (class 2604 OID 16847)
-- Name: regions region_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regions ALTER COLUMN region_id SET DEFAULT nextval('public.regions_region_id_seq'::regclass);


--
-- TOC entry 4275 (class 2606 OID 16935)
-- Name: bank_metrics bank_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_metrics
    ADD CONSTRAINT bank_metrics_pkey PRIMARY KEY (bank_metrics_id);


--
-- TOC entry 4243 (class 2606 OID 16721)
-- Name: borrowers borrowers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.borrowers
    ADD CONSTRAINT borrowers_pkey PRIMARY KEY (borrower_id);


--
-- TOC entry 4247 (class 2606 OID 16723)
-- Name: collateral_balance collateral_balance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collateral_balance
    ADD CONSTRAINT collateral_balance_pkey PRIMARY KEY (collateral_balance_id);


--
-- TOC entry 4245 (class 2606 OID 16725)
-- Name: collateral collateral_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collateral
    ADD CONSTRAINT collateral_pkey PRIMARY KEY (collateral_id);


--
-- TOC entry 4249 (class 2606 OID 16727)
-- Name: debt_facilities debt_facilities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.debt_facilities
    ADD CONSTRAINT debt_facilities_pkey PRIMARY KEY (debt_facility_id);


--
-- TOC entry 4251 (class 2606 OID 16729)
-- Name: debt_facility_balances debt_facility_balance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.debt_facility_balances
    ADD CONSTRAINT debt_facility_balance_pkey PRIMARY KEY (debt_facility_balance_id);


--
-- TOC entry 4253 (class 2606 OID 16731)
-- Name: debt_facility_options debt_facility_options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.debt_facility_options
    ADD CONSTRAINT debt_facility_options_pkey PRIMARY KEY (debt_facilities_options_id);


--
-- TOC entry 4269 (class 2606 OID 16837)
-- Name: naics_subsectors industry_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.naics_subsectors
    ADD CONSTRAINT industry_codes_pkey PRIMARY KEY (naics_subsector_id);


--
-- TOC entry 4255 (class 2606 OID 16733)
-- Name: lenders lenders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lenders
    ADD CONSTRAINT lenders_pkey PRIMARY KEY (lender_id);


--
-- TOC entry 4273 (class 2606 OID 16878)
-- Name: loan_approvals loan_approvals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loan_approvals
    ADD CONSTRAINT loan_approvals_pkey PRIMARY KEY (loan_approval_id);


--
-- TOC entry 4257 (class 2606 OID 16735)
-- Name: loan_agreements loan_facility_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loan_agreements
    ADD CONSTRAINT loan_facility_pkey PRIMARY KEY (loan_agreement_id);


--
-- TOC entry 4259 (class 2606 OID 16737)
-- Name: loan_metrics loan_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loan_metrics
    ADD CONSTRAINT loan_metrics_pkey PRIMARY KEY (loan_metrics_id);


--
-- TOC entry 4261 (class 2606 OID 16739)
-- Name: loan_tranches loan_tranches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loan_tranches
    ADD CONSTRAINT loan_tranches_pkey PRIMARY KEY (tranche_id);


--
-- TOC entry 4263 (class 2606 OID 16741)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payments_id);


--
-- TOC entry 4265 (class 2606 OID 16743)
-- Name: portfolios portfolios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolios
    ADD CONSTRAINT portfolios_pkey PRIMARY KEY (portfolio_id);


--
-- TOC entry 4267 (class 2606 OID 16745)
-- Name: rate_data rate_date_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_data
    ADD CONSTRAINT rate_date_pkey PRIMARY KEY (rate_data_id);


--
-- TOC entry 4271 (class 2606 OID 16854)
-- Name: regions regions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regions
    ADD CONSTRAINT regions_pkey PRIMARY KEY (region_id);


--
-- TOC entry 4294 (class 2606 OID 16920)
-- Name: bank_metrics Collateral; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_metrics
    ADD CONSTRAINT "Collateral" FOREIGN KEY (collateral_id) REFERENCES public.collateral(collateral_id);


--
-- TOC entry 4276 (class 2606 OID 16855)
-- Name: borrowers borrowers_corporate_hq_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.borrowers
    ADD CONSTRAINT borrowers_corporate_hq_id_fkey FOREIGN KEY (corporate_hq_id) REFERENCES public.regions(region_id) NOT VALID;


--
-- TOC entry 4277 (class 2606 OID 16865)
-- Name: borrowers borrowers_naics_subsector_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.borrowers
    ADD CONSTRAINT borrowers_naics_subsector_id_fkey FOREIGN KEY (naics_subsector_id) REFERENCES public.naics_subsectors(naics_subsector_id) NOT VALID;


--
-- TOC entry 4278 (class 2606 OID 16860)
-- Name: borrowers borrowers_revenue_geography_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.borrowers
    ADD CONSTRAINT borrowers_revenue_geography_id_fkey FOREIGN KEY (revenue_geography_id) REFERENCES public.regions(region_id) NOT VALID;


--
-- TOC entry 4279 (class 2606 OID 16904)
-- Name: collateral collateral_loan_approval_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collateral
    ADD CONSTRAINT collateral_loan_approval_id_fkey FOREIGN KEY (loan_approval_id) REFERENCES public.loan_approvals(loan_approval_id) NOT VALID;


--
-- TOC entry 4282 (class 2606 OID 16746)
-- Name: collateral_balance fk_collateral_balance_collateral; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collateral_balance
    ADD CONSTRAINT fk_collateral_balance_collateral FOREIGN KEY (collateral_id) REFERENCES public.collateral(collateral_id) NOT VALID;


--
-- TOC entry 4280 (class 2606 OID 16751)
-- Name: collateral fk_collateral_debt_facilities; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collateral
    ADD CONSTRAINT fk_collateral_debt_facilities FOREIGN KEY (debt_facility_id) REFERENCES public.debt_facilities(debt_facility_id) NOT VALID;


--
-- TOC entry 4281 (class 2606 OID 16756)
-- Name: collateral fk_collateral_loan_tranches; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collateral
    ADD CONSTRAINT fk_collateral_loan_tranches FOREIGN KEY (tranche_id) REFERENCES public.loan_tranches(tranche_id) NOT VALID;


--
-- TOC entry 4286 (class 2606 OID 16761)
-- Name: debt_facility_options fk_debt_facilities_options_debt_facilities; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.debt_facility_options
    ADD CONSTRAINT fk_debt_facilities_options_debt_facilities FOREIGN KEY (debt_facility_id) REFERENCES public.debt_facilities(debt_facility_id) NOT VALID;


--
-- TOC entry 4283 (class 2606 OID 16766)
-- Name: debt_facilities fk_debt_facilities_portfolios; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.debt_facilities
    ADD CONSTRAINT fk_debt_facilities_portfolios FOREIGN KEY (portfolio_id) REFERENCES public.portfolios(portfolio_id) NOT VALID;


--
-- TOC entry 4285 (class 2606 OID 16771)
-- Name: debt_facility_balances fk_debt_facility_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.debt_facility_balances
    ADD CONSTRAINT fk_debt_facility_id FOREIGN KEY (debt_facility_id) REFERENCES public.debt_facilities(debt_facility_id) NOT VALID;


--
-- TOC entry 4287 (class 2606 OID 16776)
-- Name: loan_agreements fk_loan_facility_borrowers; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loan_agreements
    ADD CONSTRAINT fk_loan_facility_borrowers FOREIGN KEY (borrower_id) REFERENCES public.borrowers(borrower_id);


--
-- TOC entry 4288 (class 2606 OID 16781)
-- Name: loan_metrics fk_loan_metrics_loan_tranches; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loan_metrics
    ADD CONSTRAINT fk_loan_metrics_loan_tranches FOREIGN KEY (tranche_id) REFERENCES public.loan_tranches(tranche_id) NOT VALID;


--
-- TOC entry 4289 (class 2606 OID 16786)
-- Name: loan_tranches fk_loan_tranches_loan_facilities; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loan_tranches
    ADD CONSTRAINT fk_loan_tranches_loan_facilities FOREIGN KEY (loan_agreement_id) REFERENCES public.loan_agreements(loan_agreement_id);


--
-- TOC entry 4290 (class 2606 OID 16791)
-- Name: payments fk_payments_collateral; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk_payments_collateral FOREIGN KEY (collateral_id) REFERENCES public.collateral(collateral_id) NOT VALID;


--
-- TOC entry 4291 (class 2606 OID 16796)
-- Name: rate_data fk_rate_date_loan_tranches; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_data
    ADD CONSTRAINT fk_rate_date_loan_tranches FOREIGN KEY (tranche_id) REFERENCES public.loan_tranches(tranche_id);


--
-- TOC entry 4284 (class 2606 OID 16801)
-- Name: debt_facilities kf_debt_facilities_lenders; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.debt_facilities
    ADD CONSTRAINT kf_debt_facilities_lenders FOREIGN KEY (lender_id) REFERENCES public.lenders(lender_id) NOT VALID;


--
-- TOC entry 4292 (class 2606 OID 16899)
-- Name: loan_approvals loan_approvals_debt_facility_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loan_approvals
    ADD CONSTRAINT loan_approvals_debt_facility_id_fkey FOREIGN KEY (debt_facility_id) REFERENCES public.debt_facilities(debt_facility_id) NOT VALID;


--
-- TOC entry 4293 (class 2606 OID 16889)
-- Name: loan_approvals loan_approvals_tranche_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loan_approvals
    ADD CONSTRAINT loan_approvals_tranche_id_fkey FOREIGN KEY (tranche_id) REFERENCES public.loan_tranches(tranche_id) NOT VALID;


-- Completed on 2025-12-01 09:08:43

--
-- PostgreSQL database dump complete
--

\unrestrict mDSS0fkEM4iWvqjMKuyuCmMI8AXH4kYfpp5jC4obXbDc4pzfb5gqdEHhFfhmvqP

