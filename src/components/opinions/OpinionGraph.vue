<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {OpinionService} from "@/services/opinions/OpinionService";
import {AgreeingType, OpinionGraph} from "@/services/opinions";
import * as vNG from "v-network-graph"
import {
  ForceLayout,
  ForceNodeDatum,
  ForceEdgeDatum,
} from "v-network-graph/lib/force-layout"
import {VNetworkGraph} from "v-network-graph";

interface Props {
  topicId: string;
}
const props = defineProps<Props>();

type GraphNode = {
  [index: string]: {
    name: string;
    agree: AgreeingType;
  }
}

type GraphEdge = {
  [index: string]: {
    source: string;
    target: string;
  }
}

const nodes = ref<GraphNode>({

});

const edges = ref<GraphEdge>({

});

const layouts = ref({nodes: {

  }})

const nodeCount = ref(0);
// initialize network
buildNetwork(nodeCount.value, nodes.value, edges.value)

watch(nodeCount, () => {
  buildNetwork(nodeCount.value, nodes.value, edges.value)
})

const configs = reactive(
    vNG.defineConfigs({
      view: {
        layoutHandler: new ForceLayout({
          positionFixedByDrag: false,
          positionFixedByClickWithAltKey: true,
          createSimulation: (d3, nodes, edges) => {
            // d3-force parameters
            const forceLink = d3.forceLink<ForceNodeDatum, ForceEdgeDatum>(edges).id(d => d.id)
            return d3
                .forceSimulation(nodes)
                .force("edge", forceLink.distance(90).strength(0.2))
                .force("charge", d3.forceManyBody().strength(-1000))
                .force("center", d3.forceCenter().strength(0.05))
                .alphaMin(0.001)

            // * The following are the default parameters for the simulation.
            // const forceLink = d3.forceLink<ForceNodeDatum, ForceEdgeDatum>(edges).id(d => d.id)
            // return d3
            //   .forceSimulation(nodes)
            //   .force("edge", forceLink.distance(100))
            //   .force("charge", d3.forceManyBody())
            //   .force("collide", d3.forceCollide(50).strength(0.2))
            //   .force("center", d3.forceCenter().strength(0.05))
            //   .alphaMin(0.001)
          }
        }),
      },
      node: {
        normal: {
          color: n => (n.agree === "disagree" ? "#ff0000" : "#4466cc"),
        },
        label: {
          visible: true,
        },
      },
    })
)

onMounted(async  () => {
  const opinionService = new OpinionService();
  const opinionsData: OpinionGraph[] = await opinionService.fetchGraphInTopic(parseInt(props.topicId));
  let isMostFocusingNode = true;
  opinionsData.forEach(graph => {
    graph.opinions.forEach(opinion => {
      const nodeName = "node"+opinion.id.toString();
      nodes.value[nodeName] = {
        name: opinion.title.slice(0,10) + "...",
        agree: opinion.agreeType,
      };

      if(isMostFocusingNode) {
        layouts.value.nodes[nodeName] = {
          x: 0,
          y: 0,
          fixed: true,
        }
        isMostFocusingNode = false;
      }

      const edgeName = "edge"+opinion.id.toString();
      edges.value[edgeName] = {
        source: nodeName,
        target: "node"+graph.referToId.toString()
      };
    })
  })
});


function buildNetwork(count: number, nodes: vNG.Nodes, edges: vNG.Edges) {
  const idNums = [...Array(count)].map((_, i) => i)

  // nodes
  const newNodes = Object.fromEntries(idNums.map(id => [`node${id}`, {}]))
  Object.keys(nodes).forEach(id => delete nodes[id])
  Object.assign(nodes, newNodes)

  // edges
  const makeEdgeEntry = (id1: number, id2: number) => {
    return [`edge${id1}-${id2}`, { source: `node${id1}`, target: `node${id2}` }]
  }
  const newEdges = Object.fromEntries([
    ...idNums
        .map(n => [n, (Math.floor(n / 4) * 4) % count])
        .map(([n, m]) => (n === m ? [n, (n + 4) % count] : [n, m]))
        .map(([n, m]) => makeEdgeEntry(n, m)),
  ])
  Object.keys(edges).forEach(id => delete edges[id])
  Object.assign(edges, newEdges)
}
</script>

<template>
  <v-network-graph
      class="graph"
      :zoom-level="0.5"
      :nodes="nodes"
      :edges="edges"
      :configs="configs"
      :layouts="layouts"
  />
</template>

<style>
.graph {
  width: 600px;
  height: 400px;
  border: 1px solid #000;
}
</style>