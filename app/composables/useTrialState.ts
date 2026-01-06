import { ref, computed } from "vue";

export interface Message {
    id: string;
    sender: string;
    recipient: string;
    content: string;
    timestamp: number;
}

export function useTrialState() {
    const currentCase = ref<CaseData | null>(null);
    const playerRole = ref<string | null>(null);
    const caseType = ref<"criminal" | "civil" | null>(null);
    const isActive = ref(false);
    const isSinglePlayer = ref(false);

    const currentTurn = ref<string | null>(null);
    const trialPhase = ref<
        "opening" | "examination" | "closing" | "deliberation" | "verdict"
    >("opening");

    const messages = ref<Message[]>([]);
    const evidence = ref<any[]>([]);
    const objections = ref<any[]>([]);

    const participants = ref<Map<string, { name: string; role: string }>>(
        new Map()
    );

    const caseDetailsHtml = computed(() => {
        if (!currentCase.value) return "";

        let html = `
      <p><strong>Case Type:</strong> ${caseType.value
          ?.charAt(0)
          .toUpperCase()}${caseType.value?.slice(1)}</p>
      <p><strong>Your Role:</strong> ${playerRole.value
          ?.charAt(0)
          .toUpperCase()}${playerRole.value?.slice(1)}</p>
      <p><strong>Title:</strong> ${currentCase.value.title}</p>
      <p><strong>Description:</strong> ${currentCase.value.description}</p>
      <p><strong>Facts:</strong> ${currentCase.value.facts}</p>
    `;

        if (currentCase.value.statute) {
            html += `<p><strong>Statute:</strong> ${currentCase.value.statute}</p>`;
        }

        html += `<p><strong>Difficulty:</strong> ${currentCase.value.difficulty}</p>`;

        if (
            currentCase.value.roles &&
            currentCase.value.roles[playerRole.value || ""]
        ) {
            const roleData = currentCase.value.roles[playerRole.value || ""];

            html += '<div class="role-info">';

            if (roleData.objectives && roleData.objectives.length > 0) {
                html += "<h3>Your Role Objectives:</h3><ul>";
                roleData.objectives.forEach((obj) => {
                    html += `<li>${obj}</li>`;
                });
                html += "</ul>";
            }

            if (roleData.key_arguments && roleData.key_arguments.length > 0) {
                html += "<h3>Key Arguments:</h3><ul>";
                roleData.key_arguments.forEach((arg) => {
                    html += `<li>${arg}</li>`;
                });
                html += "</ul>";
            }

            if (roleData.key_decisions && roleData.key_decisions.length > 0) {
                html += "<h3>Key Decisions:</h3><ul>";
                roleData.key_decisions.forEach((dec) => {
                    html += `<li>${dec}</li>`;
                });
                html += "</ul>";
            }

            html += "</div>";
        }

        return html;
    });

    function startTrial(
        caseData: CaseData,
        role: string,
        type: "criminal" | "civil"
    ) {
        currentCase.value = caseData;
        playerRole.value = role;
        caseType.value = type;
        isActive.value = true;
        currentTurn.value = "judge";
        trialPhase.value = "opening";

        // Clear previous state
        messages.value = [];
        evidence.value = [];
        objections.value = [];
        participants.value.clear();
    }

    function addMessage(message: Omit<Message, "id" | "timestamp">) {
        const newMessage: Message = {
            ...message,
            id: `msg-${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
        };
        messages.value.push(newMessage);
    }

    function addEvidence(evidence: any) {
        evidence.id = `ev-${Date.now()}-${Math.random()}`;
        evidence.value.push(evidence);
    }

    function addObjection(objection: any) {
        objection.id = `obj-${Date.now()}-${Math.random()}`;
        objections.value.push(objection);
    }

    function advanceTurn() {
        const turnOrder = ["judge", "prosecutor", "defense", "witness", "jury"];
        const currentIndex = turnOrder.indexOf(currentTurn.value || "");
        const nextIndex = (currentIndex + 1) % turnOrder.length;
        currentTurn.value = turnOrder[nextIndex];
    }

    function endTrial() {
        currentCase.value = null;
        playerRole.value = null;
        caseType.value = null;
        isActive.value = false;
        isSinglePlayer.value = false;
        currentTurn.value = null;
        trialPhase.value = "opening";

        messages.value = [];
        evidence.value = [];
        objections.value = [];
        participants.value.clear();
    }

    return {
        currentCase,
        playerRole,
        caseType,
        isActive,
        isSinglePlayer,
        currentTurn,
        trialPhase,
        messages,
        evidence,
        objections,
        participants,
        caseDetailsHtml,
        startTrial,
        addMessage,
        addEvidence,
        addObjection,
        advanceTurn,
        endTrial,
    };
}
