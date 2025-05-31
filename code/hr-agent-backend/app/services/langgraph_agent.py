from langgraph_models.bot_graph import build_bot_graph

graph = build_bot_graph()

def run_bot(question: str) -> str:
    result = graph.invoke({"question": question})
    return result["answer"]
