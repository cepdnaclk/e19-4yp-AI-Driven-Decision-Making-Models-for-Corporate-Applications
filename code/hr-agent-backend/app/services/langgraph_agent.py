from langgraph_models.bot_graph import GraphState, build_bot_graph

graph = build_bot_graph()

def run_bot(question: str) -> str:
    state = graph.invoke(GraphState({"question": question}))
    # print(f"[DEBUG] Final state from graph: {state}")

    answer_data = state.get("answer", {})
    return answer_data.get("result", "No answer generated.")
