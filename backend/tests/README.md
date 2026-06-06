# AreaHustle Test Suite Documentation

This folder contains all backend test scripts for verifying the core matching flows, alternative creditworthiness metrics, and third-party integrations (Aethex and Google Gemini).

## Test Descriptions

| Test File | Description | Execution |
| :--- | :--- | :--- |
| [test_backend.py](./test_backend.py) | **Core Integration Suite:** Simulates auth, the complete task matching lifecycle (open $\rightarrow$ matched $\rightarrow$ active $\rightarrow$ completed), alternative metrics updates on profile, and wallet safety escrow blocks. | `uv run python -m pytest tests/test_backend.py` or `uv run python tests/test_backend.py` |
| [test_all.py](./test_all.py) | **Test Runner:** Aggregates and executes all individual test cases in sequence. | `uv run python tests/test_all.py` |
| [test_aethex_connection.py](./test_aethex_connection.py) | **Aethex Outbound Calling Verify:** Checks connection and voice synthesis functionality of the Aethex Voice API environment. | `uv run python tests/test_aethex_connection.py` |
| [test_gemini_extraction.py](./test_gemini_extraction.py) | **Gemini Task Parser Verify:** Validates natural language voice transcription parsing into structured task entities (category, budget, neighbourhood). | `uv run python tests/test_gemini_extraction.py` |
| [test_voice_to_intent_pipeline.py](./test_voice_to_intent_pipeline.py) | **Voice-to-Intent Pipeline:** Asserts full pipeline health, processing sample audio, transcoding via PyAV, transcribing, and structured parsing. | `uv run python tests/test_voice_to_intent_pipeline.py` |
