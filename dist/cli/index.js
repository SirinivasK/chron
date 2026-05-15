#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except2, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except2)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/drizzle-orm/entity.js
function is(value, type) {
  if (!value || typeof value !== "object") {
    return false;
  }
  if (value instanceof type) {
    return true;
  }
  if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
    throw new Error(
      `Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
    );
  }
  let cls = Object.getPrototypeOf(value).constructor;
  if (cls) {
    while (cls) {
      if (entityKind in cls && cls[entityKind] === type[entityKind]) {
        return true;
      }
      cls = Object.getPrototypeOf(cls);
    }
  }
  return false;
}
var entityKind, hasOwnEntityKind;
var init_entity = __esm({
  "node_modules/drizzle-orm/entity.js"() {
    entityKind = Symbol.for("drizzle:entityKind");
    hasOwnEntityKind = Symbol.for("drizzle:hasOwnEntityKind");
  }
});

// node_modules/drizzle-orm/column.js
var Column;
var init_column = __esm({
  "node_modules/drizzle-orm/column.js"() {
    init_entity();
    Column = class {
      constructor(table, config) {
        this.table = table;
        this.config = config;
        this.name = config.name;
        this.keyAsName = config.keyAsName;
        this.notNull = config.notNull;
        this.default = config.default;
        this.defaultFn = config.defaultFn;
        this.onUpdateFn = config.onUpdateFn;
        this.hasDefault = config.hasDefault;
        this.primary = config.primaryKey;
        this.isUnique = config.isUnique;
        this.uniqueName = config.uniqueName;
        this.uniqueType = config.uniqueType;
        this.dataType = config.dataType;
        this.columnType = config.columnType;
        this.generated = config.generated;
        this.generatedIdentity = config.generatedIdentity;
      }
      static [entityKind] = "Column";
      name;
      keyAsName;
      primary;
      notNull;
      default;
      defaultFn;
      onUpdateFn;
      hasDefault;
      isUnique;
      uniqueName;
      uniqueType;
      dataType;
      columnType;
      enumValues = void 0;
      generated = void 0;
      generatedIdentity = void 0;
      config;
      mapFromDriverValue(value) {
        return value;
      }
      mapToDriverValue(value) {
        return value;
      }
      // ** @internal */
      shouldDisableInsert() {
        return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
      }
    };
  }
});

// node_modules/drizzle-orm/column-builder.js
var ColumnBuilder;
var init_column_builder = __esm({
  "node_modules/drizzle-orm/column-builder.js"() {
    init_entity();
    ColumnBuilder = class {
      static [entityKind] = "ColumnBuilder";
      config;
      constructor(name, dataType, columnType) {
        this.config = {
          name,
          keyAsName: name === "",
          notNull: false,
          default: void 0,
          hasDefault: false,
          primaryKey: false,
          isUnique: false,
          uniqueName: void 0,
          uniqueType: void 0,
          dataType,
          columnType,
          generated: void 0
        };
      }
      /**
       * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
       *
       * @example
       * ```ts
       * const users = pgTable('users', {
       * 	id: integer('id').$type<UserId>().primaryKey(),
       * 	details: json('details').$type<UserDetails>().notNull(),
       * });
       * ```
       */
      $type() {
        return this;
      }
      /**
       * Adds a `not null` clause to the column definition.
       *
       * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
       */
      notNull() {
        this.config.notNull = true;
        return this;
      }
      /**
       * Adds a `default <value>` clause to the column definition.
       *
       * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
       *
       * If you need to set a dynamic default value, use {@link $defaultFn} instead.
       */
      default(value) {
        this.config.default = value;
        this.config.hasDefault = true;
        return this;
      }
      /**
       * Adds a dynamic default value to the column.
       * The function will be called when the row is inserted, and the returned value will be used as the column value.
       *
       * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
       */
      $defaultFn(fn) {
        this.config.defaultFn = fn;
        this.config.hasDefault = true;
        return this;
      }
      /**
       * Alias for {@link $defaultFn}.
       */
      $default = this.$defaultFn;
      /**
       * Adds a dynamic update value to the column.
       * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
       * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
       *
       * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
       */
      $onUpdateFn(fn) {
        this.config.onUpdateFn = fn;
        this.config.hasDefault = true;
        return this;
      }
      /**
       * Alias for {@link $onUpdateFn}.
       */
      $onUpdate = this.$onUpdateFn;
      /**
       * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
       *
       * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
       */
      primaryKey() {
        this.config.primaryKey = true;
        this.config.notNull = true;
        return this;
      }
      /** @internal Sets the name of the column to the key within the table definition if a name was not given. */
      setName(name) {
        if (this.config.name !== "")
          return;
        this.config.name = name;
      }
    };
  }
});

// node_modules/drizzle-orm/table.utils.js
var TableName;
var init_table_utils = __esm({
  "node_modules/drizzle-orm/table.utils.js"() {
    TableName = Symbol.for("drizzle:Name");
  }
});

// node_modules/drizzle-orm/pg-core/foreign-keys.js
var ForeignKeyBuilder, ForeignKey;
var init_foreign_keys = __esm({
  "node_modules/drizzle-orm/pg-core/foreign-keys.js"() {
    init_entity();
    init_table_utils();
    ForeignKeyBuilder = class {
      static [entityKind] = "PgForeignKeyBuilder";
      /** @internal */
      reference;
      /** @internal */
      _onUpdate = "no action";
      /** @internal */
      _onDelete = "no action";
      constructor(config, actions) {
        this.reference = () => {
          const { name, columns, foreignColumns } = config();
          return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
        };
        if (actions) {
          this._onUpdate = actions.onUpdate;
          this._onDelete = actions.onDelete;
        }
      }
      onUpdate(action) {
        this._onUpdate = action === void 0 ? "no action" : action;
        return this;
      }
      onDelete(action) {
        this._onDelete = action === void 0 ? "no action" : action;
        return this;
      }
      /** @internal */
      build(table) {
        return new ForeignKey(table, this);
      }
    };
    ForeignKey = class {
      constructor(table, builder) {
        this.table = table;
        this.reference = builder.reference;
        this.onUpdate = builder._onUpdate;
        this.onDelete = builder._onDelete;
      }
      static [entityKind] = "PgForeignKey";
      reference;
      onUpdate;
      onDelete;
      getName() {
        const { name, columns, foreignColumns } = this.reference();
        const columnNames = columns.map((column) => column.name);
        const foreignColumnNames = foreignColumns.map((column) => column.name);
        const chunks = [
          this.table[TableName],
          ...columnNames,
          foreignColumns[0].table[TableName],
          ...foreignColumnNames
        ];
        return name ?? `${chunks.join("_")}_fk`;
      }
    };
  }
});

// node_modules/drizzle-orm/tracing-utils.js
function iife(fn, ...args2) {
  return fn(...args2);
}
var init_tracing_utils = __esm({
  "node_modules/drizzle-orm/tracing-utils.js"() {
  }
});

// node_modules/drizzle-orm/pg-core/unique-constraint.js
function uniqueKeyName(table, columns) {
  return `${table[TableName]}_${columns.join("_")}_unique`;
}
var UniqueConstraintBuilder, UniqueOnConstraintBuilder, UniqueConstraint;
var init_unique_constraint = __esm({
  "node_modules/drizzle-orm/pg-core/unique-constraint.js"() {
    init_entity();
    init_table_utils();
    UniqueConstraintBuilder = class {
      constructor(columns, name) {
        this.name = name;
        this.columns = columns;
      }
      static [entityKind] = "PgUniqueConstraintBuilder";
      /** @internal */
      columns;
      /** @internal */
      nullsNotDistinctConfig = false;
      nullsNotDistinct() {
        this.nullsNotDistinctConfig = true;
        return this;
      }
      /** @internal */
      build(table) {
        return new UniqueConstraint(table, this.columns, this.nullsNotDistinctConfig, this.name);
      }
    };
    UniqueOnConstraintBuilder = class {
      static [entityKind] = "PgUniqueOnConstraintBuilder";
      /** @internal */
      name;
      constructor(name) {
        this.name = name;
      }
      on(...columns) {
        return new UniqueConstraintBuilder(columns, this.name);
      }
    };
    UniqueConstraint = class {
      constructor(table, columns, nullsNotDistinct, name) {
        this.table = table;
        this.columns = columns;
        this.name = name ?? uniqueKeyName(this.table, this.columns.map((column) => column.name));
        this.nullsNotDistinct = nullsNotDistinct;
      }
      static [entityKind] = "PgUniqueConstraint";
      columns;
      name;
      nullsNotDistinct = false;
      getName() {
        return this.name;
      }
    };
  }
});

// node_modules/drizzle-orm/pg-core/utils/array.js
function parsePgArrayValue(arrayString, startFrom, inQuotes) {
  for (let i = startFrom; i < arrayString.length; i++) {
    const char = arrayString[i];
    if (char === "\\") {
      i++;
      continue;
    }
    if (char === '"') {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i + 1];
    }
    if (inQuotes) {
      continue;
    }
    if (char === "," || char === "}") {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i];
    }
  }
  return [arrayString.slice(startFrom).replace(/\\/g, ""), arrayString.length];
}
function parsePgNestedArray(arrayString, startFrom = 0) {
  const result = [];
  let i = startFrom;
  let lastCharIsComma = false;
  while (i < arrayString.length) {
    const char = arrayString[i];
    if (char === ",") {
      if (lastCharIsComma || i === startFrom) {
        result.push("");
      }
      lastCharIsComma = true;
      i++;
      continue;
    }
    lastCharIsComma = false;
    if (char === "\\") {
      i += 2;
      continue;
    }
    if (char === '"') {
      const [value2, startFrom2] = parsePgArrayValue(arrayString, i + 1, true);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    if (char === "}") {
      return [result, i + 1];
    }
    if (char === "{") {
      const [value2, startFrom2] = parsePgNestedArray(arrayString, i + 1);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    const [value, newStartFrom] = parsePgArrayValue(arrayString, i, false);
    result.push(value);
    i = newStartFrom;
  }
  return [result, i];
}
function parsePgArray(arrayString) {
  const [result] = parsePgNestedArray(arrayString, 1);
  return result;
}
function makePgArray(array2) {
  return `{${array2.map((item) => {
    if (Array.isArray(item)) {
      return makePgArray(item);
    }
    if (typeof item === "string") {
      return `"${item.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return `${item}`;
  }).join(",")}}`;
}
var init_array = __esm({
  "node_modules/drizzle-orm/pg-core/utils/array.js"() {
  }
});

// node_modules/drizzle-orm/pg-core/columns/common.js
var PgColumnBuilder, PgColumn, ExtraConfigColumn, IndexedColumn, PgArrayBuilder, PgArray;
var init_common = __esm({
  "node_modules/drizzle-orm/pg-core/columns/common.js"() {
    init_column_builder();
    init_column();
    init_entity();
    init_foreign_keys();
    init_tracing_utils();
    init_unique_constraint();
    init_array();
    PgColumnBuilder = class extends ColumnBuilder {
      foreignKeyConfigs = [];
      static [entityKind] = "PgColumnBuilder";
      array(size) {
        return new PgArrayBuilder(this.config.name, this, size);
      }
      references(ref, actions = {}) {
        this.foreignKeyConfigs.push({ ref, actions });
        return this;
      }
      unique(name, config) {
        this.config.isUnique = true;
        this.config.uniqueName = name;
        this.config.uniqueType = config?.nulls;
        return this;
      }
      generatedAlwaysAs(as) {
        this.config.generated = {
          as,
          type: "always",
          mode: "stored"
        };
        return this;
      }
      /** @internal */
      buildForeignKeys(column, table) {
        return this.foreignKeyConfigs.map(({ ref, actions }) => {
          return iife(
            (ref2, actions2) => {
              const builder = new ForeignKeyBuilder(() => {
                const foreignColumn = ref2();
                return { columns: [column], foreignColumns: [foreignColumn] };
              });
              if (actions2.onUpdate) {
                builder.onUpdate(actions2.onUpdate);
              }
              if (actions2.onDelete) {
                builder.onDelete(actions2.onDelete);
              }
              return builder.build(table);
            },
            ref,
            actions
          );
        });
      }
      /** @internal */
      buildExtraConfigColumn(table) {
        return new ExtraConfigColumn(table, this.config);
      }
    };
    PgColumn = class extends Column {
      constructor(table, config) {
        if (!config.uniqueName) {
          config.uniqueName = uniqueKeyName(table, [config.name]);
        }
        super(table, config);
        this.table = table;
      }
      static [entityKind] = "PgColumn";
    };
    ExtraConfigColumn = class extends PgColumn {
      static [entityKind] = "ExtraConfigColumn";
      getSQLType() {
        return this.getSQLType();
      }
      indexConfig = {
        order: this.config.order ?? "asc",
        nulls: this.config.nulls ?? "last",
        opClass: this.config.opClass
      };
      defaultConfig = {
        order: "asc",
        nulls: "last",
        opClass: void 0
      };
      asc() {
        this.indexConfig.order = "asc";
        return this;
      }
      desc() {
        this.indexConfig.order = "desc";
        return this;
      }
      nullsFirst() {
        this.indexConfig.nulls = "first";
        return this;
      }
      nullsLast() {
        this.indexConfig.nulls = "last";
        return this;
      }
      /**
       * ### PostgreSQL documentation quote
       *
       * > An operator class with optional parameters can be specified for each column of an index.
       * The operator class identifies the operators to be used by the index for that column.
       * For example, a B-tree index on four-byte integers would use the int4_ops class;
       * this operator class includes comparison functions for four-byte integers.
       * In practice the default operator class for the column's data type is usually sufficient.
       * The main point of having operator classes is that for some data types, there could be more than one meaningful ordering.
       * For example, we might want to sort a complex-number data type either by absolute value or by real part.
       * We could do this by defining two operator classes for the data type and then selecting the proper class when creating an index.
       * More information about operator classes check:
       *
       * ### Useful links
       * https://www.postgresql.org/docs/current/sql-createindex.html
       *
       * https://www.postgresql.org/docs/current/indexes-opclass.html
       *
       * https://www.postgresql.org/docs/current/xindex.html
       *
       * ### Additional types
       * If you have the `pg_vector` extension installed in your database, you can use the
       * `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
       *
       * **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
       *
       * @param opClass
       * @returns
       */
      op(opClass) {
        this.indexConfig.opClass = opClass;
        return this;
      }
    };
    IndexedColumn = class {
      static [entityKind] = "IndexedColumn";
      constructor(name, keyAsName, type, indexConfig) {
        this.name = name;
        this.keyAsName = keyAsName;
        this.type = type;
        this.indexConfig = indexConfig;
      }
      name;
      keyAsName;
      type;
      indexConfig;
    };
    PgArrayBuilder = class extends PgColumnBuilder {
      static [entityKind] = "PgArrayBuilder";
      constructor(name, baseBuilder, size) {
        super(name, "array", "PgArray");
        this.config.baseBuilder = baseBuilder;
        this.config.size = size;
      }
      /** @internal */
      build(table) {
        const baseColumn = this.config.baseBuilder.build(table);
        return new PgArray(
          table,
          this.config,
          baseColumn
        );
      }
    };
    PgArray = class _PgArray extends PgColumn {
      constructor(table, config, baseColumn, range) {
        super(table, config);
        this.baseColumn = baseColumn;
        this.range = range;
        this.size = config.size;
      }
      size;
      static [entityKind] = "PgArray";
      getSQLType() {
        return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
      }
      mapFromDriverValue(value) {
        if (typeof value === "string") {
          value = parsePgArray(value);
        }
        return value.map((v) => this.baseColumn.mapFromDriverValue(v));
      }
      mapToDriverValue(value, isNestedArray = false) {
        const a = value.map(
          (v) => v === null ? null : is(this.baseColumn, _PgArray) ? this.baseColumn.mapToDriverValue(v, true) : this.baseColumn.mapToDriverValue(v)
        );
        if (isNestedArray)
          return a;
        return makePgArray(a);
      }
    };
  }
});

// node_modules/drizzle-orm/pg-core/columns/enum.js
function isPgEnum(obj) {
  return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
}
var PgEnumObjectColumnBuilder, PgEnumObjectColumn, isPgEnumSym, PgEnumColumnBuilder, PgEnumColumn;
var init_enum = __esm({
  "node_modules/drizzle-orm/pg-core/columns/enum.js"() {
    init_entity();
    init_common();
    PgEnumObjectColumnBuilder = class extends PgColumnBuilder {
      static [entityKind] = "PgEnumObjectColumnBuilder";
      constructor(name, enumInstance) {
        super(name, "string", "PgEnumObjectColumn");
        this.config.enum = enumInstance;
      }
      /** @internal */
      build(table) {
        return new PgEnumObjectColumn(
          table,
          this.config
        );
      }
    };
    PgEnumObjectColumn = class extends PgColumn {
      static [entityKind] = "PgEnumObjectColumn";
      enum;
      enumValues = this.config.enum.enumValues;
      constructor(table, config) {
        super(table, config);
        this.enum = config.enum;
      }
      getSQLType() {
        return this.enum.enumName;
      }
    };
    isPgEnumSym = Symbol.for("drizzle:isPgEnum");
    PgEnumColumnBuilder = class extends PgColumnBuilder {
      static [entityKind] = "PgEnumColumnBuilder";
      constructor(name, enumInstance) {
        super(name, "string", "PgEnumColumn");
        this.config.enum = enumInstance;
      }
      /** @internal */
      build(table) {
        return new PgEnumColumn(
          table,
          this.config
        );
      }
    };
    PgEnumColumn = class extends PgColumn {
      static [entityKind] = "PgEnumColumn";
      enum = this.config.enum;
      enumValues = this.config.enum.enumValues;
      constructor(table, config) {
        super(table, config);
        this.enum = config.enum;
      }
      getSQLType() {
        return this.enum.enumName;
      }
    };
  }
});

// node_modules/drizzle-orm/subquery.js
var Subquery, WithSubquery;
var init_subquery = __esm({
  "node_modules/drizzle-orm/subquery.js"() {
    init_entity();
    Subquery = class {
      static [entityKind] = "Subquery";
      constructor(sql2, fields, alias, isWith = false, usedTables = []) {
        this._ = {
          brand: "Subquery",
          sql: sql2,
          selectedFields: fields,
          alias,
          isWith,
          usedTables
        };
      }
      // getSQL(): SQL<unknown> {
      // 	return new SQL([this]);
      // }
    };
    WithSubquery = class extends Subquery {
      static [entityKind] = "WithSubquery";
    };
  }
});

// node_modules/drizzle-orm/version.js
var version;
var init_version = __esm({
  "node_modules/drizzle-orm/version.js"() {
    version = "0.45.2";
  }
});

// node_modules/drizzle-orm/tracing.js
var otel, rawTracer, tracer;
var init_tracing = __esm({
  "node_modules/drizzle-orm/tracing.js"() {
    init_tracing_utils();
    init_version();
    tracer = {
      startActiveSpan(name, fn) {
        if (!otel) {
          return fn();
        }
        if (!rawTracer) {
          rawTracer = otel.trace.getTracer("drizzle-orm", version);
        }
        return iife(
          (otel2, rawTracer2) => rawTracer2.startActiveSpan(
            name,
            (span) => {
              try {
                return fn(span);
              } catch (e) {
                span.setStatus({
                  code: otel2.SpanStatusCode.ERROR,
                  message: e instanceof Error ? e.message : "Unknown error"
                  // eslint-disable-line no-instanceof/no-instanceof
                });
                throw e;
              } finally {
                span.end();
              }
            }
          ),
          otel,
          rawTracer
        );
      }
    };
  }
});

// node_modules/drizzle-orm/view-common.js
var ViewBaseConfig;
var init_view_common = __esm({
  "node_modules/drizzle-orm/view-common.js"() {
    ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");
  }
});

// node_modules/drizzle-orm/table.js
function getTableName(table) {
  return table[TableName];
}
function getTableUniqueName(table) {
  return `${table[Schema] ?? "public"}.${table[TableName]}`;
}
var Schema, Columns, ExtraConfigColumns, OriginalName, BaseName, IsAlias, ExtraConfigBuilder, IsDrizzleTable, Table;
var init_table = __esm({
  "node_modules/drizzle-orm/table.js"() {
    init_entity();
    init_table_utils();
    Schema = Symbol.for("drizzle:Schema");
    Columns = Symbol.for("drizzle:Columns");
    ExtraConfigColumns = Symbol.for("drizzle:ExtraConfigColumns");
    OriginalName = Symbol.for("drizzle:OriginalName");
    BaseName = Symbol.for("drizzle:BaseName");
    IsAlias = Symbol.for("drizzle:IsAlias");
    ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
    IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");
    Table = class {
      static [entityKind] = "Table";
      /** @internal */
      static Symbol = {
        Name: TableName,
        Schema,
        OriginalName,
        Columns,
        ExtraConfigColumns,
        BaseName,
        IsAlias,
        ExtraConfigBuilder
      };
      /**
       * @internal
       * Can be changed if the table is aliased.
       */
      [TableName];
      /**
       * @internal
       * Used to store the original name of the table, before any aliasing.
       */
      [OriginalName];
      /** @internal */
      [Schema];
      /** @internal */
      [Columns];
      /** @internal */
      [ExtraConfigColumns];
      /**
       *  @internal
       * Used to store the table name before the transformation via the `tableCreator` functions.
       */
      [BaseName];
      /** @internal */
      [IsAlias] = false;
      /** @internal */
      [IsDrizzleTable] = true;
      /** @internal */
      [ExtraConfigBuilder] = void 0;
      constructor(name, schema, baseName) {
        this[TableName] = this[OriginalName] = name;
        this[Schema] = schema;
        this[BaseName] = baseName;
      }
    };
  }
});

// node_modules/drizzle-orm/sql/sql.js
function isSQLWrapper(value) {
  return value !== null && value !== void 0 && typeof value.getSQL === "function";
}
function mergeQueries(queries) {
  const result = { sql: "", params: [] };
  for (const query of queries) {
    result.sql += query.sql;
    result.params.push(...query.params);
    if (query.typings?.length) {
      if (!result.typings) {
        result.typings = [];
      }
      result.typings.push(...query.typings);
    }
  }
  return result;
}
function isDriverValueEncoder(value) {
  return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
}
function sql(strings, ...params) {
  const queryChunks = [];
  if (params.length > 0 || strings.length > 0 && strings[0] !== "") {
    queryChunks.push(new StringChunk(strings[0]));
  }
  for (const [paramIndex, param2] of params.entries()) {
    queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
  }
  return new SQL(queryChunks);
}
function fillPlaceholders(params, values) {
  return params.map((p) => {
    if (is(p, Placeholder)) {
      if (!(p.name in values)) {
        throw new Error(`No value for placeholder "${p.name}" was provided`);
      }
      return values[p.name];
    }
    if (is(p, Param) && is(p.value, Placeholder)) {
      if (!(p.value.name in values)) {
        throw new Error(`No value for placeholder "${p.value.name}" was provided`);
      }
      return p.encoder.mapToDriverValue(values[p.value.name]);
    }
    return p;
  });
}
var FakePrimitiveParam, StringChunk, SQL, Name, noopDecoder, noopEncoder, noopMapper, Param, Placeholder, IsDrizzleView, View;
var init_sql = __esm({
  "node_modules/drizzle-orm/sql/sql.js"() {
    init_entity();
    init_enum();
    init_subquery();
    init_tracing();
    init_view_common();
    init_column();
    init_table();
    FakePrimitiveParam = class {
      static [entityKind] = "FakePrimitiveParam";
    };
    StringChunk = class {
      static [entityKind] = "StringChunk";
      value;
      constructor(value) {
        this.value = Array.isArray(value) ? value : [value];
      }
      getSQL() {
        return new SQL([this]);
      }
    };
    SQL = class _SQL {
      constructor(queryChunks) {
        this.queryChunks = queryChunks;
        for (const chunk of queryChunks) {
          if (is(chunk, Table)) {
            const schemaName = chunk[Table.Symbol.Schema];
            this.usedTables.push(
              schemaName === void 0 ? chunk[Table.Symbol.Name] : schemaName + "." + chunk[Table.Symbol.Name]
            );
          }
        }
      }
      static [entityKind] = "SQL";
      /** @internal */
      decoder = noopDecoder;
      shouldInlineParams = false;
      /** @internal */
      usedTables = [];
      append(query) {
        this.queryChunks.push(...query.queryChunks);
        return this;
      }
      toQuery(config) {
        return tracer.startActiveSpan("drizzle.buildSQL", (span) => {
          const query = this.buildQueryFromSourceParams(this.queryChunks, config);
          span?.setAttributes({
            "drizzle.query.text": query.sql,
            "drizzle.query.params": JSON.stringify(query.params)
          });
          return query;
        });
      }
      buildQueryFromSourceParams(chunks, _config) {
        const config = Object.assign({}, _config, {
          inlineParams: _config.inlineParams || this.shouldInlineParams,
          paramStartIndex: _config.paramStartIndex || { value: 0 }
        });
        const {
          casing,
          escapeName,
          escapeParam,
          prepareTyping,
          inlineParams,
          paramStartIndex
        } = config;
        return mergeQueries(chunks.map((chunk) => {
          if (is(chunk, StringChunk)) {
            return { sql: chunk.value.join(""), params: [] };
          }
          if (is(chunk, Name)) {
            return { sql: escapeName(chunk.value), params: [] };
          }
          if (chunk === void 0) {
            return { sql: "", params: [] };
          }
          if (Array.isArray(chunk)) {
            const result = [new StringChunk("(")];
            for (const [i, p] of chunk.entries()) {
              result.push(p);
              if (i < chunk.length - 1) {
                result.push(new StringChunk(", "));
              }
            }
            result.push(new StringChunk(")"));
            return this.buildQueryFromSourceParams(result, config);
          }
          if (is(chunk, _SQL)) {
            return this.buildQueryFromSourceParams(chunk.queryChunks, {
              ...config,
              inlineParams: inlineParams || chunk.shouldInlineParams
            });
          }
          if (is(chunk, Table)) {
            const schemaName = chunk[Table.Symbol.Schema];
            const tableName = chunk[Table.Symbol.Name];
            return {
              sql: schemaName === void 0 || chunk[IsAlias] ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
              params: []
            };
          }
          if (is(chunk, Column)) {
            const columnName = casing.getColumnCasing(chunk);
            if (_config.invokeSource === "indexes") {
              return { sql: escapeName(columnName), params: [] };
            }
            const schemaName = chunk.table[Table.Symbol.Schema];
            return {
              sql: chunk.table[IsAlias] || schemaName === void 0 ? escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName) : escapeName(schemaName) + "." + escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(columnName),
              params: []
            };
          }
          if (is(chunk, View)) {
            const schemaName = chunk[ViewBaseConfig].schema;
            const viewName = chunk[ViewBaseConfig].name;
            return {
              sql: schemaName === void 0 || chunk[ViewBaseConfig].isAlias ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
              params: []
            };
          }
          if (is(chunk, Param)) {
            if (is(chunk.value, Placeholder)) {
              return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
            }
            const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
            if (is(mappedValue, _SQL)) {
              return this.buildQueryFromSourceParams([mappedValue], config);
            }
            if (inlineParams) {
              return { sql: this.mapInlineParam(mappedValue, config), params: [] };
            }
            let typings = ["none"];
            if (prepareTyping) {
              typings = [prepareTyping(chunk.encoder)];
            }
            return { sql: escapeParam(paramStartIndex.value++, mappedValue), params: [mappedValue], typings };
          }
          if (is(chunk, Placeholder)) {
            return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
          }
          if (is(chunk, _SQL.Aliased) && chunk.fieldAlias !== void 0) {
            return { sql: escapeName(chunk.fieldAlias), params: [] };
          }
          if (is(chunk, Subquery)) {
            if (chunk._.isWith) {
              return { sql: escapeName(chunk._.alias), params: [] };
            }
            return this.buildQueryFromSourceParams([
              new StringChunk("("),
              chunk._.sql,
              new StringChunk(") "),
              new Name(chunk._.alias)
            ], config);
          }
          if (isPgEnum(chunk)) {
            if (chunk.schema) {
              return { sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName), params: [] };
            }
            return { sql: escapeName(chunk.enumName), params: [] };
          }
          if (isSQLWrapper(chunk)) {
            if (chunk.shouldOmitSQLParens?.()) {
              return this.buildQueryFromSourceParams([chunk.getSQL()], config);
            }
            return this.buildQueryFromSourceParams([
              new StringChunk("("),
              chunk.getSQL(),
              new StringChunk(")")
            ], config);
          }
          if (inlineParams) {
            return { sql: this.mapInlineParam(chunk, config), params: [] };
          }
          return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
        }));
      }
      mapInlineParam(chunk, { escapeString }) {
        if (chunk === null) {
          return "null";
        }
        if (typeof chunk === "number" || typeof chunk === "boolean") {
          return chunk.toString();
        }
        if (typeof chunk === "string") {
          return escapeString(chunk);
        }
        if (typeof chunk === "object") {
          const mappedValueAsString = chunk.toString();
          if (mappedValueAsString === "[object Object]") {
            return escapeString(JSON.stringify(chunk));
          }
          return escapeString(mappedValueAsString);
        }
        throw new Error("Unexpected param value: " + chunk);
      }
      getSQL() {
        return this;
      }
      as(alias) {
        if (alias === void 0) {
          return this;
        }
        return new _SQL.Aliased(this, alias);
      }
      mapWith(decoder) {
        this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
        return this;
      }
      inlineParams() {
        this.shouldInlineParams = true;
        return this;
      }
      /**
       * This method is used to conditionally include a part of the query.
       *
       * @param condition - Condition to check
       * @returns itself if the condition is `true`, otherwise `undefined`
       */
      if(condition) {
        return condition ? this : void 0;
      }
    };
    Name = class {
      constructor(value) {
        this.value = value;
      }
      static [entityKind] = "Name";
      brand;
      getSQL() {
        return new SQL([this]);
      }
    };
    noopDecoder = {
      mapFromDriverValue: (value) => value
    };
    noopEncoder = {
      mapToDriverValue: (value) => value
    };
    noopMapper = {
      ...noopDecoder,
      ...noopEncoder
    };
    Param = class {
      /**
       * @param value - Parameter value
       * @param encoder - Encoder to convert the value to a driver parameter
       */
      constructor(value, encoder = noopEncoder) {
        this.value = value;
        this.encoder = encoder;
      }
      static [entityKind] = "Param";
      brand;
      getSQL() {
        return new SQL([this]);
      }
    };
    ((sql2) => {
      function empty() {
        return new SQL([]);
      }
      sql2.empty = empty;
      function fromList(list) {
        return new SQL(list);
      }
      sql2.fromList = fromList;
      function raw(str) {
        return new SQL([new StringChunk(str)]);
      }
      sql2.raw = raw;
      function join3(chunks, separator) {
        const result = [];
        for (const [i, chunk] of chunks.entries()) {
          if (i > 0 && separator !== void 0) {
            result.push(separator);
          }
          result.push(chunk);
        }
        return new SQL(result);
      }
      sql2.join = join3;
      function identifier(value) {
        return new Name(value);
      }
      sql2.identifier = identifier;
      function placeholder2(name2) {
        return new Placeholder(name2);
      }
      sql2.placeholder = placeholder2;
      function param2(value, encoder) {
        return new Param(value, encoder);
      }
      sql2.param = param2;
    })(sql || (sql = {}));
    ((SQL2) => {
      class Aliased {
        constructor(sql2, fieldAlias) {
          this.sql = sql2;
          this.fieldAlias = fieldAlias;
        }
        static [entityKind] = "SQL.Aliased";
        /** @internal */
        isSelectionField = false;
        getSQL() {
          return this.sql;
        }
        /** @internal */
        clone() {
          return new Aliased(this.sql, this.fieldAlias);
        }
      }
      SQL2.Aliased = Aliased;
    })(SQL || (SQL = {}));
    Placeholder = class {
      constructor(name2) {
        this.name = name2;
      }
      static [entityKind] = "Placeholder";
      getSQL() {
        return new SQL([this]);
      }
    };
    IsDrizzleView = Symbol.for("drizzle:IsDrizzleView");
    View = class {
      static [entityKind] = "View";
      /** @internal */
      [ViewBaseConfig];
      /** @internal */
      [IsDrizzleView] = true;
      constructor({ name: name2, schema, selectedFields, query }) {
        this[ViewBaseConfig] = {
          name: name2,
          originalName: name2,
          schema,
          selectedFields,
          query,
          isExisting: !query,
          isAlias: false
        };
      }
      getSQL() {
        return new SQL([this]);
      }
    };
    Column.prototype.getSQL = function() {
      return new SQL([this]);
    };
    Table.prototype.getSQL = function() {
      return new SQL([this]);
    };
    Subquery.prototype.getSQL = function() {
      return new SQL([this]);
    };
  }
});

// node_modules/drizzle-orm/alias.js
function aliasedTable(table, tableAlias) {
  return new Proxy(table, new TableAliasProxyHandler(tableAlias, false));
}
function aliasedTableColumn(column, tableAlias) {
  return new Proxy(
    column,
    new ColumnAliasProxyHandler(new Proxy(column.table, new TableAliasProxyHandler(tableAlias, false)))
  );
}
function mapColumnsInAliasedSQLToAlias(query, alias) {
  return new SQL.Aliased(mapColumnsInSQLToAlias(query.sql, alias), query.fieldAlias);
}
function mapColumnsInSQLToAlias(query, alias) {
  return sql.join(query.queryChunks.map((c) => {
    if (is(c, Column)) {
      return aliasedTableColumn(c, alias);
    }
    if (is(c, SQL)) {
      return mapColumnsInSQLToAlias(c, alias);
    }
    if (is(c, SQL.Aliased)) {
      return mapColumnsInAliasedSQLToAlias(c, alias);
    }
    return c;
  }));
}
var ColumnAliasProxyHandler, TableAliasProxyHandler, RelationTableAliasProxyHandler;
var init_alias = __esm({
  "node_modules/drizzle-orm/alias.js"() {
    init_column();
    init_entity();
    init_sql();
    init_table();
    init_view_common();
    ColumnAliasProxyHandler = class {
      constructor(table) {
        this.table = table;
      }
      static [entityKind] = "ColumnAliasProxyHandler";
      get(columnObj, prop) {
        if (prop === "table") {
          return this.table;
        }
        return columnObj[prop];
      }
    };
    TableAliasProxyHandler = class {
      constructor(alias, replaceOriginalName) {
        this.alias = alias;
        this.replaceOriginalName = replaceOriginalName;
      }
      static [entityKind] = "TableAliasProxyHandler";
      get(target, prop) {
        if (prop === Table.Symbol.IsAlias) {
          return true;
        }
        if (prop === Table.Symbol.Name) {
          return this.alias;
        }
        if (this.replaceOriginalName && prop === Table.Symbol.OriginalName) {
          return this.alias;
        }
        if (prop === ViewBaseConfig) {
          return {
            ...target[ViewBaseConfig],
            name: this.alias,
            isAlias: true
          };
        }
        if (prop === Table.Symbol.Columns) {
          const columns = target[Table.Symbol.Columns];
          if (!columns) {
            return columns;
          }
          const proxiedColumns = {};
          Object.keys(columns).map((key) => {
            proxiedColumns[key] = new Proxy(
              columns[key],
              new ColumnAliasProxyHandler(new Proxy(target, this))
            );
          });
          return proxiedColumns;
        }
        const value = target[prop];
        if (is(value, Column)) {
          return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(target, this)));
        }
        return value;
      }
    };
    RelationTableAliasProxyHandler = class {
      constructor(alias) {
        this.alias = alias;
      }
      static [entityKind] = "RelationTableAliasProxyHandler";
      get(target, prop) {
        if (prop === "sourceTable") {
          return aliasedTable(target.sourceTable, this.alias);
        }
        return target[prop];
      }
    };
  }
});

// node_modules/drizzle-orm/errors.js
var DrizzleError, DrizzleQueryError, TransactionRollbackError;
var init_errors = __esm({
  "node_modules/drizzle-orm/errors.js"() {
    init_entity();
    DrizzleError = class extends Error {
      static [entityKind] = "DrizzleError";
      constructor({ message, cause }) {
        super(message);
        this.name = "DrizzleError";
        this.cause = cause;
      }
    };
    DrizzleQueryError = class _DrizzleQueryError extends Error {
      constructor(query, params, cause) {
        super(`Failed query: ${query}
params: ${params}`);
        this.query = query;
        this.params = params;
        this.cause = cause;
        Error.captureStackTrace(this, _DrizzleQueryError);
        if (cause)
          this.cause = cause;
      }
    };
    TransactionRollbackError = class extends DrizzleError {
      static [entityKind] = "TransactionRollbackError";
      constructor() {
        super({ message: "Rollback" });
      }
    };
  }
});

// node_modules/drizzle-orm/logger.js
var ConsoleLogWriter, DefaultLogger, NoopLogger;
var init_logger = __esm({
  "node_modules/drizzle-orm/logger.js"() {
    init_entity();
    ConsoleLogWriter = class {
      static [entityKind] = "ConsoleLogWriter";
      write(message) {
        console.log(message);
      }
    };
    DefaultLogger = class {
      static [entityKind] = "DefaultLogger";
      writer;
      constructor(config) {
        this.writer = config?.writer ?? new ConsoleLogWriter();
      }
      logQuery(query, params) {
        const stringifiedParams = params.map((p) => {
          try {
            return JSON.stringify(p);
          } catch {
            return String(p);
          }
        });
        const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
        this.writer.write(`Query: ${query}${paramsStr}`);
      }
    };
    NoopLogger = class {
      static [entityKind] = "NoopLogger";
      logQuery() {
      }
    };
  }
});

// node_modules/drizzle-orm/operations.js
var init_operations = __esm({
  "node_modules/drizzle-orm/operations.js"() {
  }
});

// node_modules/drizzle-orm/query-promise.js
var QueryPromise;
var init_query_promise = __esm({
  "node_modules/drizzle-orm/query-promise.js"() {
    init_entity();
    QueryPromise = class {
      static [entityKind] = "QueryPromise";
      [Symbol.toStringTag] = "QueryPromise";
      catch(onRejected) {
        return this.then(void 0, onRejected);
      }
      finally(onFinally) {
        return this.then(
          (value) => {
            onFinally?.();
            return value;
          },
          (reason) => {
            onFinally?.();
            throw reason;
          }
        );
      }
      then(onFulfilled, onRejected) {
        return this.execute().then(onFulfilled, onRejected);
      }
    };
  }
});

// node_modules/drizzle-orm/utils.js
function mapResultRow(columns, row, joinsNotNullableMap) {
  const nullifyMap = {};
  const result = columns.reduce(
    (result2, { path, field }, columnIndex) => {
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else if (is(field, Subquery)) {
        decoder = field._.sql.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      let node = result2;
      for (const [pathChunkIndex, pathChunk] of path.entries()) {
        if (pathChunkIndex < path.length - 1) {
          if (!(pathChunk in node)) {
            node[pathChunk] = {};
          }
          node = node[pathChunk];
        } else {
          const rawValue = row[columnIndex];
          const value = node[pathChunk] = rawValue === null ? null : decoder.mapFromDriverValue(rawValue);
          if (joinsNotNullableMap && is(field, Column) && path.length === 2) {
            const objectName = path[0];
            if (!(objectName in nullifyMap)) {
              nullifyMap[objectName] = value === null ? getTableName(field.table) : false;
            } else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== getTableName(field.table)) {
              nullifyMap[objectName] = false;
            }
          }
        }
      }
      return result2;
    },
    {}
  );
  if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
    for (const [objectName, tableName] of Object.entries(nullifyMap)) {
      if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) {
        result[objectName] = null;
      }
    }
  }
  return result;
}
function orderSelectedFields(fields, pathPrefix) {
  return Object.entries(fields).reduce((result, [name, field]) => {
    if (typeof name !== "string") {
      return result;
    }
    const newPath = pathPrefix ? [...pathPrefix, name] : [name];
    if (is(field, Column) || is(field, SQL) || is(field, SQL.Aliased) || is(field, Subquery)) {
      result.push({ path: newPath, field });
    } else if (is(field, Table)) {
      result.push(...orderSelectedFields(field[Table.Symbol.Columns], newPath));
    } else {
      result.push(...orderSelectedFields(field, newPath));
    }
    return result;
  }, []);
}
function haveSameKeys(left, right) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }
  for (const [index, key] of leftKeys.entries()) {
    if (key !== rightKeys[index]) {
      return false;
    }
  }
  return true;
}
function mapUpdateSet(table, values) {
  const entries = Object.entries(values).filter(([, value]) => value !== void 0).map(([key, value]) => {
    if (is(value, SQL) || is(value, Column)) {
      return [key, value];
    } else {
      return [key, new Param(value, table[Table.Symbol.Columns][key])];
    }
  });
  if (entries.length === 0) {
    throw new Error("No values to set");
  }
  return Object.fromEntries(entries);
}
function applyMixins(baseClass, extendedClasses) {
  for (const extendedClass of extendedClasses) {
    for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
      if (name === "constructor")
        continue;
      Object.defineProperty(
        baseClass.prototype,
        name,
        Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || /* @__PURE__ */ Object.create(null)
      );
    }
  }
}
function getTableColumns(table) {
  return table[Table.Symbol.Columns];
}
function getTableLikeName(table) {
  return is(table, Subquery) ? table._.alias : is(table, View) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : table[Table.Symbol.IsAlias] ? table[Table.Symbol.Name] : table[Table.Symbol.BaseName];
}
function getColumnNameAndConfig(a, b) {
  return {
    name: typeof a === "string" && a.length > 0 ? a : "",
    config: typeof a === "object" ? a : b
  };
}
function isConfig(data) {
  if (typeof data !== "object" || data === null)
    return false;
  if (data.constructor.name !== "Object")
    return false;
  if ("logger" in data) {
    const type = typeof data["logger"];
    if (type !== "boolean" && (type !== "object" || typeof data["logger"]["logQuery"] !== "function") && type !== "undefined")
      return false;
    return true;
  }
  if ("schema" in data) {
    const type = typeof data["schema"];
    if (type !== "object" && type !== "undefined")
      return false;
    return true;
  }
  if ("casing" in data) {
    const type = typeof data["casing"];
    if (type !== "string" && type !== "undefined")
      return false;
    return true;
  }
  if ("mode" in data) {
    if (data["mode"] !== "default" || data["mode"] !== "planetscale" || data["mode"] !== void 0)
      return false;
    return true;
  }
  if ("connection" in data) {
    const type = typeof data["connection"];
    if (type !== "string" && type !== "object" && type !== "undefined")
      return false;
    return true;
  }
  if ("client" in data) {
    const type = typeof data["client"];
    if (type !== "object" && type !== "function" && type !== "undefined")
      return false;
    return true;
  }
  if (Object.keys(data).length === 0)
    return true;
  return false;
}
var textDecoder;
var init_utils = __esm({
  "node_modules/drizzle-orm/utils.js"() {
    init_column();
    init_entity();
    init_sql();
    init_subquery();
    init_table();
    init_view_common();
    textDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder();
  }
});

// node_modules/drizzle-orm/pg-core/table.js
var InlineForeignKeys, EnableRLS, PgTable;
var init_table2 = __esm({
  "node_modules/drizzle-orm/pg-core/table.js"() {
    init_entity();
    init_table();
    InlineForeignKeys = Symbol.for("drizzle:PgInlineForeignKeys");
    EnableRLS = Symbol.for("drizzle:EnableRLS");
    PgTable = class extends Table {
      static [entityKind] = "PgTable";
      /** @internal */
      static Symbol = Object.assign({}, Table.Symbol, {
        InlineForeignKeys,
        EnableRLS
      });
      /**@internal */
      [InlineForeignKeys] = [];
      /** @internal */
      [EnableRLS] = false;
      /** @internal */
      [Table.Symbol.ExtraConfigBuilder] = void 0;
      /** @internal */
      [Table.Symbol.ExtraConfigColumns] = {};
    };
  }
});

// node_modules/drizzle-orm/pg-core/primary-keys.js
var PrimaryKeyBuilder, PrimaryKey;
var init_primary_keys = __esm({
  "node_modules/drizzle-orm/pg-core/primary-keys.js"() {
    init_entity();
    init_table2();
    PrimaryKeyBuilder = class {
      static [entityKind] = "PgPrimaryKeyBuilder";
      /** @internal */
      columns;
      /** @internal */
      name;
      constructor(columns, name) {
        this.columns = columns;
        this.name = name;
      }
      /** @internal */
      build(table) {
        return new PrimaryKey(table, this.columns, this.name);
      }
    };
    PrimaryKey = class {
      constructor(table, columns, name) {
        this.table = table;
        this.columns = columns;
        this.name = name;
      }
      static [entityKind] = "PgPrimaryKey";
      columns;
      name;
      getName() {
        return this.name ?? `${this.table[PgTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
      }
    };
  }
});

// node_modules/drizzle-orm/sql/expressions/conditions.js
function bindIfParam(value, column) {
  if (isDriverValueEncoder(column) && !isSQLWrapper(value) && !is(value, Param) && !is(value, Placeholder) && !is(value, Column) && !is(value, Table) && !is(value, View)) {
    return new Param(value, column);
  }
  return value;
}
function and(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" and ")),
    new StringChunk(")")
  ]);
}
function or(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" or ")),
    new StringChunk(")")
  ]);
}
function not(condition) {
  return sql`not ${condition}`;
}
function inArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      return sql`false`;
    }
    return sql`${column} in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} in ${bindIfParam(values, column)}`;
}
function notInArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      return sql`true`;
    }
    return sql`${column} not in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} not in ${bindIfParam(values, column)}`;
}
function isNull(value) {
  return sql`${value} is null`;
}
function isNotNull(value) {
  return sql`${value} is not null`;
}
function exists(subquery) {
  return sql`exists ${subquery}`;
}
function notExists(subquery) {
  return sql`not exists ${subquery}`;
}
function between(column, min, max) {
  return sql`${column} between ${bindIfParam(min, column)} and ${bindIfParam(
    max,
    column
  )}`;
}
function notBetween(column, min, max) {
  return sql`${column} not between ${bindIfParam(
    min,
    column
  )} and ${bindIfParam(max, column)}`;
}
function like(column, value) {
  return sql`${column} like ${value}`;
}
function notLike(column, value) {
  return sql`${column} not like ${value}`;
}
function ilike(column, value) {
  return sql`${column} ilike ${value}`;
}
function notIlike(column, value) {
  return sql`${column} not ilike ${value}`;
}
var eq, ne, gt, gte, lt, lte;
var init_conditions = __esm({
  "node_modules/drizzle-orm/sql/expressions/conditions.js"() {
    init_column();
    init_entity();
    init_table();
    init_sql();
    eq = (left, right) => {
      return sql`${left} = ${bindIfParam(right, left)}`;
    };
    ne = (left, right) => {
      return sql`${left} <> ${bindIfParam(right, left)}`;
    };
    gt = (left, right) => {
      return sql`${left} > ${bindIfParam(right, left)}`;
    };
    gte = (left, right) => {
      return sql`${left} >= ${bindIfParam(right, left)}`;
    };
    lt = (left, right) => {
      return sql`${left} < ${bindIfParam(right, left)}`;
    };
    lte = (left, right) => {
      return sql`${left} <= ${bindIfParam(right, left)}`;
    };
  }
});

// node_modules/drizzle-orm/sql/expressions/select.js
function asc(column) {
  return sql`${column} asc`;
}
function desc(column) {
  return sql`${column} desc`;
}
var init_select = __esm({
  "node_modules/drizzle-orm/sql/expressions/select.js"() {
    init_sql();
  }
});

// node_modules/drizzle-orm/sql/expressions/index.js
var init_expressions = __esm({
  "node_modules/drizzle-orm/sql/expressions/index.js"() {
    init_conditions();
    init_select();
  }
});

// node_modules/drizzle-orm/relations.js
function getOperators() {
  return {
    and,
    between,
    eq,
    exists,
    gt,
    gte,
    ilike,
    inArray,
    isNull,
    isNotNull,
    like,
    lt,
    lte,
    ne,
    not,
    notBetween,
    notExists,
    notLike,
    notIlike,
    notInArray,
    or,
    sql
  };
}
function getOrderByOperators() {
  return {
    sql,
    asc,
    desc
  };
}
function extractTablesRelationalConfig(schema, configHelpers) {
  if (Object.keys(schema).length === 1 && "default" in schema && !is(schema["default"], Table)) {
    schema = schema["default"];
  }
  const tableNamesMap = {};
  const relationsBuffer = {};
  const tablesConfig = {};
  for (const [key, value] of Object.entries(schema)) {
    if (is(value, Table)) {
      const dbName = getTableUniqueName(value);
      const bufferedRelations = relationsBuffer[dbName];
      tableNamesMap[dbName] = key;
      tablesConfig[key] = {
        tsName: key,
        dbName: value[Table.Symbol.Name],
        schema: value[Table.Symbol.Schema],
        columns: value[Table.Symbol.Columns],
        relations: bufferedRelations?.relations ?? {},
        primaryKey: bufferedRelations?.primaryKey ?? []
      };
      for (const column of Object.values(
        value[Table.Symbol.Columns]
      )) {
        if (column.primary) {
          tablesConfig[key].primaryKey.push(column);
        }
      }
      const extraConfig = value[Table.Symbol.ExtraConfigBuilder]?.(value[Table.Symbol.ExtraConfigColumns]);
      if (extraConfig) {
        for (const configEntry of Object.values(extraConfig)) {
          if (is(configEntry, PrimaryKeyBuilder)) {
            tablesConfig[key].primaryKey.push(...configEntry.columns);
          }
        }
      }
    } else if (is(value, Relations)) {
      const dbName = getTableUniqueName(value.table);
      const tableName = tableNamesMap[dbName];
      const relations2 = value.config(
        configHelpers(value.table)
      );
      let primaryKey;
      for (const [relationName, relation] of Object.entries(relations2)) {
        if (tableName) {
          const tableConfig = tablesConfig[tableName];
          tableConfig.relations[relationName] = relation;
          if (primaryKey) {
            tableConfig.primaryKey.push(...primaryKey);
          }
        } else {
          if (!(dbName in relationsBuffer)) {
            relationsBuffer[dbName] = {
              relations: {},
              primaryKey
            };
          }
          relationsBuffer[dbName].relations[relationName] = relation;
        }
      }
    }
  }
  return { tables: tablesConfig, tableNamesMap };
}
function createOne(sourceTable) {
  return function one(table, config) {
    return new One(
      sourceTable,
      table,
      config,
      config?.fields.reduce((res, f) => res && f.notNull, true) ?? false
    );
  };
}
function createMany(sourceTable) {
  return function many(referencedTable, config) {
    return new Many(sourceTable, referencedTable, config);
  };
}
function normalizeRelation(schema, tableNamesMap, relation) {
  if (is(relation, One) && relation.config) {
    return {
      fields: relation.config.fields,
      references: relation.config.references
    };
  }
  const referencedTableTsName = tableNamesMap[getTableUniqueName(relation.referencedTable)];
  if (!referencedTableTsName) {
    throw new Error(
      `Table "${relation.referencedTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const referencedTableConfig = schema[referencedTableTsName];
  if (!referencedTableConfig) {
    throw new Error(`Table "${referencedTableTsName}" not found in schema`);
  }
  const sourceTable = relation.sourceTable;
  const sourceTableTsName = tableNamesMap[getTableUniqueName(sourceTable)];
  if (!sourceTableTsName) {
    throw new Error(
      `Table "${sourceTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const reverseRelations = [];
  for (const referencedTableRelation of Object.values(
    referencedTableConfig.relations
  )) {
    if (relation.relationName && relation !== referencedTableRelation && referencedTableRelation.relationName === relation.relationName || !relation.relationName && referencedTableRelation.referencedTable === relation.sourceTable) {
      reverseRelations.push(referencedTableRelation);
    }
  }
  if (reverseRelations.length > 1) {
    throw relation.relationName ? new Error(
      `There are multiple relations with name "${relation.relationName}" in table "${referencedTableTsName}"`
    ) : new Error(
      `There are multiple relations between "${referencedTableTsName}" and "${relation.sourceTable[Table.Symbol.Name]}". Please specify relation name`
    );
  }
  if (reverseRelations[0] && is(reverseRelations[0], One) && reverseRelations[0].config) {
    return {
      fields: reverseRelations[0].config.references,
      references: reverseRelations[0].config.fields
    };
  }
  throw new Error(
    `There is not enough information to infer relation "${sourceTableTsName}.${relation.fieldName}"`
  );
}
function createTableRelationsHelpers(sourceTable) {
  return {
    one: createOne(sourceTable),
    many: createMany(sourceTable)
  };
}
function mapRelationalRow(tablesConfig, tableConfig, row, buildQueryResultSelection, mapColumnValue = (value) => value) {
  const result = {};
  for (const [
    selectionItemIndex,
    selectionItem
  ] of buildQueryResultSelection.entries()) {
    if (selectionItem.isJson) {
      const relation = tableConfig.relations[selectionItem.tsKey];
      const rawSubRows = row[selectionItemIndex];
      const subRows = typeof rawSubRows === "string" ? JSON.parse(rawSubRows) : rawSubRows;
      result[selectionItem.tsKey] = is(relation, One) ? subRows && mapRelationalRow(
        tablesConfig,
        tablesConfig[selectionItem.relationTableTsKey],
        subRows,
        selectionItem.selection,
        mapColumnValue
      ) : subRows.map(
        (subRow) => mapRelationalRow(
          tablesConfig,
          tablesConfig[selectionItem.relationTableTsKey],
          subRow,
          selectionItem.selection,
          mapColumnValue
        )
      );
    } else {
      const value = mapColumnValue(row[selectionItemIndex]);
      const field = selectionItem.field;
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      result[selectionItem.tsKey] = value === null ? null : decoder.mapFromDriverValue(value);
    }
  }
  return result;
}
var Relation, Relations, One, Many;
var init_relations = __esm({
  "node_modules/drizzle-orm/relations.js"() {
    init_table();
    init_column();
    init_entity();
    init_primary_keys();
    init_expressions();
    init_sql();
    Relation = class {
      constructor(sourceTable, referencedTable, relationName) {
        this.sourceTable = sourceTable;
        this.referencedTable = referencedTable;
        this.relationName = relationName;
        this.referencedTableName = referencedTable[Table.Symbol.Name];
      }
      static [entityKind] = "Relation";
      referencedTableName;
      fieldName;
    };
    Relations = class {
      constructor(table, config) {
        this.table = table;
        this.config = config;
      }
      static [entityKind] = "Relations";
    };
    One = class _One extends Relation {
      constructor(sourceTable, referencedTable, config, isNullable) {
        super(sourceTable, referencedTable, config?.relationName);
        this.config = config;
        this.isNullable = isNullable;
      }
      static [entityKind] = "One";
      withFieldName(fieldName) {
        const relation = new _One(
          this.sourceTable,
          this.referencedTable,
          this.config,
          this.isNullable
        );
        relation.fieldName = fieldName;
        return relation;
      }
    };
    Many = class _Many extends Relation {
      constructor(sourceTable, referencedTable, config) {
        super(sourceTable, referencedTable, config?.relationName);
        this.config = config;
      }
      static [entityKind] = "Many";
      withFieldName(fieldName) {
        const relation = new _Many(
          this.sourceTable,
          this.referencedTable,
          this.config
        );
        relation.fieldName = fieldName;
        return relation;
      }
    };
  }
});

// node_modules/drizzle-orm/sql/functions/aggregate.js
var init_aggregate = __esm({
  "node_modules/drizzle-orm/sql/functions/aggregate.js"() {
  }
});

// node_modules/drizzle-orm/sql/functions/vector.js
var init_vector = __esm({
  "node_modules/drizzle-orm/sql/functions/vector.js"() {
  }
});

// node_modules/drizzle-orm/sql/functions/index.js
var init_functions = __esm({
  "node_modules/drizzle-orm/sql/functions/index.js"() {
    init_aggregate();
    init_vector();
  }
});

// node_modules/drizzle-orm/sql/index.js
var init_sql2 = __esm({
  "node_modules/drizzle-orm/sql/index.js"() {
    init_expressions();
    init_functions();
    init_sql();
  }
});

// node_modules/drizzle-orm/index.js
var init_drizzle_orm = __esm({
  "node_modules/drizzle-orm/index.js"() {
    init_alias();
    init_column_builder();
    init_column();
    init_entity();
    init_errors();
    init_logger();
    init_operations();
    init_query_promise();
    init_relations();
    init_sql2();
    init_subquery();
    init_table();
    init_utils();
    init_view_common();
  }
});

// node_modules/@libsql/core/lib-esm/api.js
var LibsqlError, LibsqlBatchError;
var init_api = __esm({
  "node_modules/@libsql/core/lib-esm/api.js"() {
    LibsqlError = class extends Error {
      /** Machine-readable error code. */
      code;
      /** Extended error code with more specific information (e.g., SQLITE_CONSTRAINT_PRIMARYKEY). */
      extendedCode;
      /** Raw numeric error code */
      rawCode;
      constructor(message, code, extendedCode, rawCode, cause) {
        if (code !== void 0) {
          message = `${code}: ${message}`;
        }
        super(message, { cause });
        this.code = code;
        this.extendedCode = extendedCode;
        this.rawCode = rawCode;
        this.name = "LibsqlError";
      }
    };
    LibsqlBatchError = class extends LibsqlError {
      /** The zero-based index of the statement that failed in the batch. */
      statementIndex;
      constructor(message, statementIndex, code, extendedCode, rawCode, cause) {
        super(message, code, extendedCode, rawCode, cause);
        this.statementIndex = statementIndex;
        this.name = "LibsqlBatchError";
      }
    };
  }
});

// node_modules/@libsql/core/lib-esm/uri.js
function parseUri(text2) {
  const match = URI_RE.exec(text2);
  if (match === null) {
    throw new LibsqlError(`The URL '${text2}' is not in a valid format`, "URL_INVALID");
  }
  const groups = match.groups;
  const scheme = groups["scheme"];
  const authority = groups["authority"] !== void 0 ? parseAuthority(groups["authority"]) : void 0;
  const path = percentDecode(groups["path"]);
  const query = groups["query"] !== void 0 ? parseQuery(groups["query"]) : void 0;
  const fragment = groups["fragment"] !== void 0 ? percentDecode(groups["fragment"]) : void 0;
  return { scheme, authority, path, query, fragment };
}
function parseAuthority(text2) {
  const match = AUTHORITY_RE.exec(text2);
  if (match === null) {
    throw new LibsqlError("The authority part of the URL is not in a valid format", "URL_INVALID");
  }
  const groups = match.groups;
  const host = percentDecode(groups["host_br"] ?? groups["host"]);
  const port = groups["port"] ? parseInt(groups["port"], 10) : void 0;
  const userinfo = groups["username"] !== void 0 ? {
    username: percentDecode(groups["username"]),
    password: groups["password"] !== void 0 ? percentDecode(groups["password"]) : void 0
  } : void 0;
  return { host, port, userinfo };
}
function parseQuery(text2) {
  const sequences = text2.split("&");
  const pairs = [];
  for (const sequence of sequences) {
    if (sequence === "") {
      continue;
    }
    let key;
    let value;
    const splitIdx = sequence.indexOf("=");
    if (splitIdx < 0) {
      key = sequence;
      value = "";
    } else {
      key = sequence.substring(0, splitIdx);
      value = sequence.substring(splitIdx + 1);
    }
    pairs.push({
      key: percentDecode(key.replaceAll("+", " ")),
      value: percentDecode(value.replaceAll("+", " "))
    });
  }
  return { pairs };
}
function percentDecode(text2) {
  try {
    return decodeURIComponent(text2);
  } catch (e) {
    if (e instanceof URIError) {
      throw new LibsqlError(`URL component has invalid percent encoding: ${e}`, "URL_INVALID", void 0, void 0, e);
    }
    throw e;
  }
}
function encodeBaseUrl(scheme, authority, path) {
  if (authority === void 0) {
    throw new LibsqlError(`URL with scheme ${JSON.stringify(scheme + ":")} requires authority (the "//" part)`, "URL_INVALID");
  }
  const schemeText = `${scheme}:`;
  const hostText = encodeHost(authority.host);
  const portText = encodePort(authority.port);
  const userinfoText = encodeUserinfo(authority.userinfo);
  const authorityText = `//${userinfoText}${hostText}${portText}`;
  let pathText = path.split("/").map(encodeURIComponent).join("/");
  if (pathText !== "" && !pathText.startsWith("/")) {
    pathText = "/" + pathText;
  }
  return new URL(`${schemeText}${authorityText}${pathText}`);
}
function encodeHost(host) {
  return host.includes(":") ? `[${encodeURI(host)}]` : encodeURI(host);
}
function encodePort(port) {
  return port !== void 0 ? `:${port}` : "";
}
function encodeUserinfo(userinfo) {
  if (userinfo === void 0) {
    return "";
  }
  const usernameText = encodeURIComponent(userinfo.username);
  const passwordText = userinfo.password !== void 0 ? `:${encodeURIComponent(userinfo.password)}` : "";
  return `${usernameText}${passwordText}@`;
}
var URI_RE, AUTHORITY_RE;
var init_uri = __esm({
  "node_modules/@libsql/core/lib-esm/uri.js"() {
    init_api();
    URI_RE = (() => {
      const SCHEME = "(?<scheme>[A-Za-z][A-Za-z.+-]*)";
      const AUTHORITY = "(?<authority>[^/?#]*)";
      const PATH = "(?<path>[^?#]*)";
      const QUERY = "(?<query>[^#]*)";
      const FRAGMENT = "(?<fragment>.*)";
      return new RegExp(`^${SCHEME}:(//${AUTHORITY})?${PATH}(\\?${QUERY})?(#${FRAGMENT})?$`, "su");
    })();
    AUTHORITY_RE = (() => {
      return new RegExp(`^((?<username>[^:]*)(:(?<password>.*))?@)?((?<host>[^:\\[\\]]*)|(\\[(?<host_br>[^\\[\\]]*)\\]))(:(?<port>[0-9]*))?$`, "su");
    })();
  }
});

// node_modules/js-base64/base64.mjs
var version2, VERSION, _hasBuffer, _TD, _TE, b64ch, b64chs, b64tab, b64re, _fromCC, _U8Afrom, _mkUriSafe, _tidyB64, btoaPolyfill, _btoa, _fromUint8Array, fromUint8Array, cb_utob, re_utob, utob, _encode, encode, encodeURI2, re_btou, cb_btou, btou, atobPolyfill, _atob, _toUint8Array, toUint8Array, _decode, _unURI, decode, isValid, _noEnum, extendString, extendUint8Array, extendBuiltins, gBase64;
var init_base64 = __esm({
  "node_modules/js-base64/base64.mjs"() {
    version2 = "3.7.8";
    VERSION = version2;
    _hasBuffer = typeof Buffer === "function";
    _TD = typeof TextDecoder === "function" ? new TextDecoder() : void 0;
    _TE = typeof TextEncoder === "function" ? new TextEncoder() : void 0;
    b64ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    b64chs = Array.prototype.slice.call(b64ch);
    b64tab = ((a) => {
      let tab = {};
      a.forEach((c, i) => tab[c] = i);
      return tab;
    })(b64chs);
    b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
    _fromCC = String.fromCharCode.bind(String);
    _U8Afrom = typeof Uint8Array.from === "function" ? Uint8Array.from.bind(Uint8Array) : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
    _mkUriSafe = (src) => src.replace(/=/g, "").replace(/[+\/]/g, (m0) => m0 == "+" ? "-" : "_");
    _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, "");
    btoaPolyfill = (bin) => {
      let u32, c0, c1, c2, asc2 = "";
      const pad = bin.length % 3;
      for (let i = 0; i < bin.length; ) {
        if ((c0 = bin.charCodeAt(i++)) > 255 || (c1 = bin.charCodeAt(i++)) > 255 || (c2 = bin.charCodeAt(i++)) > 255)
          throw new TypeError("invalid character found");
        u32 = c0 << 16 | c1 << 8 | c2;
        asc2 += b64chs[u32 >> 18 & 63] + b64chs[u32 >> 12 & 63] + b64chs[u32 >> 6 & 63] + b64chs[u32 & 63];
      }
      return pad ? asc2.slice(0, pad - 3) + "===".substring(pad) : asc2;
    };
    _btoa = typeof btoa === "function" ? (bin) => btoa(bin) : _hasBuffer ? (bin) => Buffer.from(bin, "binary").toString("base64") : btoaPolyfill;
    _fromUint8Array = _hasBuffer ? (u8a) => Buffer.from(u8a).toString("base64") : (u8a) => {
      const maxargs = 4096;
      let strs = [];
      for (let i = 0, l = u8a.length; i < l; i += maxargs) {
        strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
      }
      return _btoa(strs.join(""));
    };
    fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
    cb_utob = (c) => {
      if (c.length < 2) {
        var cc = c.charCodeAt(0);
        return cc < 128 ? c : cc < 2048 ? _fromCC(192 | cc >>> 6) + _fromCC(128 | cc & 63) : _fromCC(224 | cc >>> 12 & 15) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
      } else {
        var cc = 65536 + (c.charCodeAt(0) - 55296) * 1024 + (c.charCodeAt(1) - 56320);
        return _fromCC(240 | cc >>> 18 & 7) + _fromCC(128 | cc >>> 12 & 63) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
      }
    };
    re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    utob = (u) => u.replace(re_utob, cb_utob);
    _encode = _hasBuffer ? (s) => Buffer.from(s, "utf8").toString("base64") : _TE ? (s) => _fromUint8Array(_TE.encode(s)) : (s) => _btoa(utob(s));
    encode = (src, urlsafe = false) => urlsafe ? _mkUriSafe(_encode(src)) : _encode(src);
    encodeURI2 = (src) => encode(src, true);
    re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
    cb_btou = (cccc) => {
      switch (cccc.length) {
        case 4:
          var cp = (7 & cccc.charCodeAt(0)) << 18 | (63 & cccc.charCodeAt(1)) << 12 | (63 & cccc.charCodeAt(2)) << 6 | 63 & cccc.charCodeAt(3), offset = cp - 65536;
          return _fromCC((offset >>> 10) + 55296) + _fromCC((offset & 1023) + 56320);
        case 3:
          return _fromCC((15 & cccc.charCodeAt(0)) << 12 | (63 & cccc.charCodeAt(1)) << 6 | 63 & cccc.charCodeAt(2));
        default:
          return _fromCC((31 & cccc.charCodeAt(0)) << 6 | 63 & cccc.charCodeAt(1));
      }
    };
    btou = (b) => b.replace(re_btou, cb_btou);
    atobPolyfill = (asc2) => {
      asc2 = asc2.replace(/\s+/g, "");
      if (!b64re.test(asc2))
        throw new TypeError("malformed base64.");
      asc2 += "==".slice(2 - (asc2.length & 3));
      let u24, r1, r2;
      let binArray = [];
      for (let i = 0; i < asc2.length; ) {
        u24 = b64tab[asc2.charAt(i++)] << 18 | b64tab[asc2.charAt(i++)] << 12 | (r1 = b64tab[asc2.charAt(i++)]) << 6 | (r2 = b64tab[asc2.charAt(i++)]);
        if (r1 === 64) {
          binArray.push(_fromCC(u24 >> 16 & 255));
        } else if (r2 === 64) {
          binArray.push(_fromCC(u24 >> 16 & 255, u24 >> 8 & 255));
        } else {
          binArray.push(_fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255));
        }
      }
      return binArray.join("");
    };
    _atob = typeof atob === "function" ? (asc2) => atob(_tidyB64(asc2)) : _hasBuffer ? (asc2) => Buffer.from(asc2, "base64").toString("binary") : atobPolyfill;
    _toUint8Array = _hasBuffer ? (a) => _U8Afrom(Buffer.from(a, "base64")) : (a) => _U8Afrom(_atob(a).split("").map((c) => c.charCodeAt(0)));
    toUint8Array = (a) => _toUint8Array(_unURI(a));
    _decode = _hasBuffer ? (a) => Buffer.from(a, "base64").toString("utf8") : _TD ? (a) => _TD.decode(_toUint8Array(a)) : (a) => btou(_atob(a));
    _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == "-" ? "+" : "/"));
    decode = (src) => _decode(_unURI(src));
    isValid = (src) => {
      if (typeof src !== "string")
        return false;
      const s = src.replace(/\s+/g, "").replace(/={0,2}$/, "");
      return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
    };
    _noEnum = (v) => {
      return {
        value: v,
        enumerable: false,
        writable: true,
        configurable: true
      };
    };
    extendString = function() {
      const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
      _add("fromBase64", function() {
        return decode(this);
      });
      _add("toBase64", function(urlsafe) {
        return encode(this, urlsafe);
      });
      _add("toBase64URI", function() {
        return encode(this, true);
      });
      _add("toBase64URL", function() {
        return encode(this, true);
      });
      _add("toUint8Array", function() {
        return toUint8Array(this);
      });
    };
    extendUint8Array = function() {
      const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
      _add("toBase64", function(urlsafe) {
        return fromUint8Array(this, urlsafe);
      });
      _add("toBase64URI", function() {
        return fromUint8Array(this, true);
      });
      _add("toBase64URL", function() {
        return fromUint8Array(this, true);
      });
    };
    extendBuiltins = () => {
      extendString();
      extendUint8Array();
    };
    gBase64 = {
      version: version2,
      VERSION,
      atob: _atob,
      atobPolyfill,
      btoa: _btoa,
      btoaPolyfill,
      fromBase64: decode,
      toBase64: encode,
      encode,
      encodeURI: encodeURI2,
      encodeURL: encodeURI2,
      utob,
      btou,
      decode,
      isValid,
      fromUint8Array,
      toUint8Array,
      extendString,
      extendUint8Array,
      extendBuiltins
    };
  }
});

// node_modules/@libsql/core/lib-esm/util.js
function transactionModeToBegin(mode) {
  if (mode === "write") {
    return "BEGIN IMMEDIATE";
  } else if (mode === "read") {
    return "BEGIN TRANSACTION READONLY";
  } else if (mode === "deferred") {
    return "BEGIN DEFERRED";
  } else {
    throw RangeError('Unknown transaction mode, supported values are "write", "read" and "deferred"');
  }
}
function rowToJson(row) {
  return Array.prototype.map.call(row, valueToJson);
}
function valueToJson(value) {
  if (typeof value === "bigint") {
    return "" + value;
  } else if (value instanceof ArrayBuffer) {
    return gBase64.fromUint8Array(new Uint8Array(value));
  } else {
    return value;
  }
}
var supportedUrlLink, ResultSetImpl;
var init_util = __esm({
  "node_modules/@libsql/core/lib-esm/util.js"() {
    init_base64();
    supportedUrlLink = "https://github.com/libsql/libsql-client-ts#supported-urls";
    ResultSetImpl = class {
      columns;
      columnTypes;
      rows;
      rowsAffected;
      lastInsertRowid;
      constructor(columns, columnTypes, rows, rowsAffected, lastInsertRowid) {
        this.columns = columns;
        this.columnTypes = columnTypes;
        this.rows = rows;
        this.rowsAffected = rowsAffected;
        this.lastInsertRowid = lastInsertRowid;
      }
      toJSON() {
        return {
          columns: this.columns,
          columnTypes: this.columnTypes,
          rows: this.rows.map(rowToJson),
          rowsAffected: this.rowsAffected,
          lastInsertRowid: this.lastInsertRowid !== void 0 ? "" + this.lastInsertRowid : null
        };
      }
    };
  }
});

// node_modules/@libsql/core/lib-esm/config.js
function isInMemoryConfig(config) {
  return config.scheme === "file" && (config.path === ":memory:" || config.path.startsWith(":memory:?"));
}
function expandConfig(config, preferHttp) {
  if (typeof config !== "object") {
    throw new TypeError(`Expected client configuration as object, got ${typeof config}`);
  }
  let { url, authToken, tls, intMode, concurrency } = config;
  concurrency = Math.max(0, concurrency || 20);
  intMode ??= "number";
  let connectionQueryParams = [];
  if (url === inMemoryMode) {
    url = "file::memory:";
  }
  const uri = parseUri(url);
  const originalUriScheme = uri.scheme.toLowerCase();
  const isInMemoryMode = originalUriScheme === "file" && uri.path === inMemoryMode && uri.authority === void 0;
  let queryParamsDef;
  if (isInMemoryMode) {
    queryParamsDef = {
      cache: {
        values: ["shared", "private"],
        update: (key, value) => connectionQueryParams.push(`${key}=${value}`)
      }
    };
  } else {
    queryParamsDef = {
      tls: {
        values: ["0", "1"],
        update: (_, value) => tls = value === "1"
      },
      authToken: {
        update: (_, value) => authToken = value
      }
    };
  }
  for (const { key, value } of uri.query?.pairs ?? []) {
    if (!Object.hasOwn(queryParamsDef, key)) {
      throw new LibsqlError(`Unsupported URL query parameter ${JSON.stringify(key)}`, "URL_PARAM_NOT_SUPPORTED");
    }
    const queryParamDef = queryParamsDef[key];
    if (queryParamDef.values !== void 0 && !queryParamDef.values.includes(value)) {
      throw new LibsqlError(`Unknown value for the "${key}" query argument: ${JSON.stringify(value)}. Supported values are: [${queryParamDef.values.map((x) => '"' + x + '"').join(", ")}]`, "URL_INVALID");
    }
    if (queryParamDef.update !== void 0) {
      queryParamDef?.update(key, value);
    }
  }
  const connectionQueryParamsString = connectionQueryParams.length === 0 ? "" : `?${connectionQueryParams.join("&")}`;
  const path = uri.path + connectionQueryParamsString;
  let scheme;
  if (originalUriScheme === "libsql") {
    if (tls === false) {
      if (uri.authority?.port === void 0) {
        throw new LibsqlError('A "libsql:" URL with ?tls=0 must specify an explicit port', "URL_INVALID");
      }
      scheme = preferHttp ? "http" : "ws";
    } else {
      scheme = preferHttp ? "https" : "wss";
    }
  } else {
    scheme = originalUriScheme;
  }
  if (scheme === "http" || scheme === "ws") {
    tls ??= false;
  } else {
    tls ??= true;
  }
  if (scheme !== "http" && scheme !== "ws" && scheme !== "https" && scheme !== "wss" && scheme !== "file") {
    throw new LibsqlError(`The client supports only "libsql:", "wss:", "ws:", "https:", "http:" and "file:" URLs, got ${JSON.stringify(uri.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
  }
  if (intMode !== "number" && intMode !== "bigint" && intMode !== "string") {
    throw new TypeError(`Invalid value for intMode, expected "number", "bigint" or "string", got ${JSON.stringify(intMode)}`);
  }
  if (uri.fragment !== void 0) {
    throw new LibsqlError(`URL fragments are not supported: ${JSON.stringify("#" + uri.fragment)}`, "URL_INVALID");
  }
  if (isInMemoryMode) {
    return {
      scheme: "file",
      tls: false,
      path,
      intMode,
      concurrency,
      syncUrl: config.syncUrl,
      syncInterval: config.syncInterval,
      readYourWrites: config.readYourWrites,
      offline: config.offline,
      fetch: config.fetch,
      authToken: void 0,
      encryptionKey: void 0,
      remoteEncryptionKey: void 0,
      authority: void 0
    };
  }
  return {
    scheme,
    tls,
    authority: uri.authority,
    path,
    authToken,
    intMode,
    concurrency,
    encryptionKey: config.encryptionKey,
    remoteEncryptionKey: config.remoteEncryptionKey,
    syncUrl: config.syncUrl,
    syncInterval: config.syncInterval,
    readYourWrites: config.readYourWrites,
    offline: config.offline,
    fetch: config.fetch
  };
}
var inMemoryMode;
var init_config = __esm({
  "node_modules/@libsql/core/lib-esm/config.js"() {
    init_api();
    init_uri();
    init_util();
    inMemoryMode = ":memory:";
  }
});

// node_modules/@neon-rs/load/dist/index.js
var require_dist = __commonJS({
  "node_modules/@neon-rs/load/dist/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc2 = Object.getOwnPropertyDescriptor(m, k);
      if (!desc2 || ("get" in desc2 ? !m.__esModule : desc2.writable || desc2.configurable)) {
        desc2 = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc2);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.load = exports2.currentTarget = void 0;
    var path = __importStar(require("path"));
    var fs = __importStar(require("fs"));
    function currentTarget() {
      let os = null;
      switch (process.platform) {
        case "android":
          switch (process.arch) {
            case "arm":
              return "android-arm-eabi";
            case "arm64":
              return "android-arm64";
          }
          os = "Android";
          break;
        case "win32":
          switch (process.arch) {
            case "x64":
              return "win32-x64-msvc";
            case "arm64":
              return "win32-arm64-msvc";
            case "ia32":
              return "win32-ia32-msvc";
          }
          os = "Windows";
          break;
        case "darwin":
          switch (process.arch) {
            case "x64":
              return "darwin-x64";
            case "arm64":
              return "darwin-arm64";
          }
          os = "macOS";
          break;
        case "linux":
          switch (process.arch) {
            case "x64":
            case "arm64":
              return isGlibc() ? `linux-${process.arch}-gnu` : `linux-${process.arch}-musl`;
            case "arm":
              return "linux-arm-gnueabihf";
          }
          os = "Linux";
          break;
        case "freebsd":
          if (process.arch === "x64") {
            return "freebsd-x64";
          }
          os = "FreeBSD";
          break;
      }
      if (os) {
        throw new Error(`Neon: unsupported ${os} architecture: ${process.arch}`);
      }
      throw new Error(`Neon: unsupported system: ${process.platform}`);
    }
    exports2.currentTarget = currentTarget;
    function isGlibc() {
      const report = process.report?.getReport();
      if (typeof report !== "object" || !report || !("header" in report)) {
        return false;
      }
      const header = report.header;
      return typeof header === "object" && !!header && "glibcVersionRuntime" in header;
    }
    function load(dirname2) {
      const m = path.join(dirname2, "index.node");
      return fs.existsSync(m) ? require(m) : null;
    }
    exports2.load = load;
  }
});

// node_modules/libsql/node_modules/detect-libc/lib/process.js
var require_process = __commonJS({
  "node_modules/libsql/node_modules/detect-libc/lib/process.js"(exports2, module2) {
    "use strict";
    var isLinux = () => process.platform === "linux";
    var report = null;
    var getReport = () => {
      if (!report) {
        report = isLinux() && process.report ? process.report.getReport() : {};
      }
      return report;
    };
    module2.exports = { isLinux, getReport };
  }
});

// node_modules/libsql/node_modules/detect-libc/lib/filesystem.js
var require_filesystem = __commonJS({
  "node_modules/libsql/node_modules/detect-libc/lib/filesystem.js"(exports2, module2) {
    "use strict";
    var fs = require("fs");
    var LDD_PATH = "/usr/bin/ldd";
    var readFileSync = (path) => fs.readFileSync(path, "utf-8");
    var readFile = (path) => new Promise((resolve, reject) => {
      fs.readFile(path, "utf-8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    module2.exports = {
      LDD_PATH,
      readFileSync,
      readFile
    };
  }
});

// node_modules/libsql/node_modules/detect-libc/lib/detect-libc.js
var require_detect_libc = __commonJS({
  "node_modules/libsql/node_modules/detect-libc/lib/detect-libc.js"(exports2, module2) {
    "use strict";
    var childProcess = require("child_process");
    var { isLinux, getReport } = require_process();
    var { LDD_PATH, readFile, readFileSync } = require_filesystem();
    var cachedFamilyFilesystem;
    var cachedVersionFilesystem;
    var command2 = "getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true";
    var commandOut = "";
    var safeCommand = () => {
      if (!commandOut) {
        return new Promise((resolve) => {
          childProcess.exec(command2, (err, out) => {
            commandOut = err ? " " : out;
            resolve(commandOut);
          });
        });
      }
      return commandOut;
    };
    var safeCommandSync = () => {
      if (!commandOut) {
        try {
          commandOut = childProcess.execSync(command2, { encoding: "utf8" });
        } catch (_err) {
          commandOut = " ";
        }
      }
      return commandOut;
    };
    var GLIBC = "glibc";
    var RE_GLIBC_VERSION = /GLIBC\s(\d+\.\d+)/;
    var MUSL = "musl";
    var GLIBC_ON_LDD = GLIBC.toUpperCase();
    var MUSL_ON_LDD = MUSL.toLowerCase();
    var isFileMusl = (f) => f.includes("libc.musl-") || f.includes("ld-musl-");
    var familyFromReport = () => {
      const report = getReport();
      if (report.header && report.header.glibcVersionRuntime) {
        return GLIBC;
      }
      if (Array.isArray(report.sharedObjects)) {
        if (report.sharedObjects.some(isFileMusl)) {
          return MUSL;
        }
      }
      return null;
    };
    var familyFromCommand = (out) => {
      const [getconf, ldd1] = out.split(/[\r\n]+/);
      if (getconf && getconf.includes(GLIBC)) {
        return GLIBC;
      }
      if (ldd1 && ldd1.includes(MUSL)) {
        return MUSL;
      }
      return null;
    };
    var getFamilyFromLddContent = (content) => {
      if (content.includes(MUSL_ON_LDD)) {
        return MUSL;
      }
      if (content.includes(GLIBC_ON_LDD)) {
        return GLIBC;
      }
      return null;
    };
    var familyFromFilesystem = async () => {
      if (cachedFamilyFilesystem !== void 0) {
        return cachedFamilyFilesystem;
      }
      cachedFamilyFilesystem = null;
      try {
        const lddContent = await readFile(LDD_PATH);
        cachedFamilyFilesystem = getFamilyFromLddContent(lddContent);
      } catch (e) {
      }
      return cachedFamilyFilesystem;
    };
    var familyFromFilesystemSync = () => {
      if (cachedFamilyFilesystem !== void 0) {
        return cachedFamilyFilesystem;
      }
      cachedFamilyFilesystem = null;
      try {
        const lddContent = readFileSync(LDD_PATH);
        cachedFamilyFilesystem = getFamilyFromLddContent(lddContent);
      } catch (e) {
      }
      return cachedFamilyFilesystem;
    };
    var family = async () => {
      let family2 = null;
      if (isLinux()) {
        family2 = await familyFromFilesystem();
        if (!family2) {
          family2 = familyFromReport();
        }
        if (!family2) {
          const out = await safeCommand();
          family2 = familyFromCommand(out);
        }
      }
      return family2;
    };
    var familySync = () => {
      let family2 = null;
      if (isLinux()) {
        family2 = familyFromFilesystemSync();
        if (!family2) {
          family2 = familyFromReport();
        }
        if (!family2) {
          const out = safeCommandSync();
          family2 = familyFromCommand(out);
        }
      }
      return family2;
    };
    var isNonGlibcLinux = async () => isLinux() && await family() !== GLIBC;
    var isNonGlibcLinuxSync = () => isLinux() && familySync() !== GLIBC;
    var versionFromFilesystem = async () => {
      if (cachedVersionFilesystem !== void 0) {
        return cachedVersionFilesystem;
      }
      cachedVersionFilesystem = null;
      try {
        const lddContent = await readFile(LDD_PATH);
        const versionMatch = lddContent.match(RE_GLIBC_VERSION);
        if (versionMatch) {
          cachedVersionFilesystem = versionMatch[1];
        }
      } catch (e) {
      }
      return cachedVersionFilesystem;
    };
    var versionFromFilesystemSync = () => {
      if (cachedVersionFilesystem !== void 0) {
        return cachedVersionFilesystem;
      }
      cachedVersionFilesystem = null;
      try {
        const lddContent = readFileSync(LDD_PATH);
        const versionMatch = lddContent.match(RE_GLIBC_VERSION);
        if (versionMatch) {
          cachedVersionFilesystem = versionMatch[1];
        }
      } catch (e) {
      }
      return cachedVersionFilesystem;
    };
    var versionFromReport = () => {
      const report = getReport();
      if (report.header && report.header.glibcVersionRuntime) {
        return report.header.glibcVersionRuntime;
      }
      return null;
    };
    var versionSuffix = (s) => s.trim().split(/\s+/)[1];
    var versionFromCommand = (out) => {
      const [getconf, ldd1, ldd2] = out.split(/[\r\n]+/);
      if (getconf && getconf.includes(GLIBC)) {
        return versionSuffix(getconf);
      }
      if (ldd1 && ldd2 && ldd1.includes(MUSL)) {
        return versionSuffix(ldd2);
      }
      return null;
    };
    var version3 = async () => {
      let version4 = null;
      if (isLinux()) {
        version4 = await versionFromFilesystem();
        if (!version4) {
          version4 = versionFromReport();
        }
        if (!version4) {
          const out = await safeCommand();
          version4 = versionFromCommand(out);
        }
      }
      return version4;
    };
    var versionSync = () => {
      let version4 = null;
      if (isLinux()) {
        version4 = versionFromFilesystemSync();
        if (!version4) {
          version4 = versionFromReport();
        }
        if (!version4) {
          const out = safeCommandSync();
          version4 = versionFromCommand(out);
        }
      }
      return version4;
    };
    module2.exports = {
      GLIBC,
      MUSL,
      family,
      familySync,
      isNonGlibcLinux,
      isNonGlibcLinuxSync,
      version: version3,
      versionSync
    };
  }
});

// node_modules/libsql/auth.js
var require_auth = __commonJS({
  "node_modules/libsql/auth.js"(exports2, module2) {
    var Authorization = {
      /**
       * Allow access to a resource.
       * @type {number}
       */
      ALLOW: 0,
      /**
       * Deny access to a resource and throw an error in `prepare()`.
       * @type {number}
       */
      DENY: 1
    };
    module2.exports = Authorization;
  }
});

// node_modules/libsql/sqlite-error.js
var require_sqlite_error = __commonJS({
  "node_modules/libsql/sqlite-error.js"(exports2, module2) {
    "use strict";
    var descriptor = { value: "SqliteError", writable: true, enumerable: false, configurable: true };
    function SqliteError(message, code, rawCode) {
      if (new.target !== SqliteError) {
        return new SqliteError(message, code);
      }
      if (typeof code !== "string") {
        throw new TypeError("Expected second argument to be a string");
      }
      Error.call(this, message);
      descriptor.value = "" + message;
      Object.defineProperty(this, "message", descriptor);
      Error.captureStackTrace(this, SqliteError);
      this.code = code;
      this.rawCode = rawCode;
    }
    Object.setPrototypeOf(SqliteError, Error);
    Object.setPrototypeOf(SqliteError.prototype, Error.prototype);
    Object.defineProperty(SqliteError.prototype, "name", descriptor);
    module2.exports = SqliteError;
  }
});

// node_modules/libsql/index.js
var require_libsql = __commonJS({
  "node_modules/libsql/index.js"(exports2, module2) {
    "use strict";
    var { load, currentTarget } = require_dist();
    var { familySync, GLIBC, MUSL } = require_detect_libc();
    function requireNative() {
      if (process.env.LIBSQL_JS_DEV) {
        return load(__dirname);
      }
      let target = currentTarget();
      if (familySync() == GLIBC) {
        switch (target) {
          case "linux-x64-musl":
            target = "linux-x64-gnu";
            break;
          case "linux-arm64-musl":
            target = "linux-arm64-gnu";
            break;
        }
      }
      if (target === "linux-arm-gnueabihf" && familySync() == MUSL) {
        target = "linux-arm-musleabihf";
      }
      return require(`@libsql/${target}`);
    }
    var {
      databaseOpen,
      databaseOpenWithSync,
      databaseInTransaction,
      databaseInterrupt,
      databaseClose,
      databaseSyncSync,
      databaseSyncUntilSync,
      databaseExecSync,
      databasePrepareSync,
      databaseDefaultSafeIntegers,
      databaseAuthorizer,
      databaseLoadExtension,
      databaseMaxWriteReplicationIndex,
      statementRaw,
      statementIsReader,
      statementGet,
      statementRun,
      statementInterrupt,
      statementRowsSync,
      statementColumns,
      statementSafeIntegers,
      rowsNext
    } = requireNative();
    var Authorization = require_auth();
    var SqliteError = require_sqlite_error();
    function convertError(err) {
      if (err.libsqlError) {
        return new SqliteError(err.message, err.code, err.rawCode);
      }
      return err;
    }
    var Database2 = class {
      /**
       * Creates a new database connection. If the database file pointed to by `path` does not exists, it will be created.
       *
       * @constructor
       * @param {string} path - Path to the database file.
       */
      constructor(path, opts) {
        const encryptionCipher = opts?.encryptionCipher ?? "aes256cbc";
        if (opts && opts.syncUrl) {
          var authToken = "";
          if (opts.syncAuth) {
            console.warn("Warning: The `syncAuth` option is deprecated, please use `authToken` option instead.");
            authToken = opts.syncAuth;
          } else if (opts.authToken) {
            authToken = opts.authToken;
          }
          const encryptionKey = opts?.encryptionKey ?? "";
          const syncPeriod = opts?.syncPeriod ?? 0;
          const readYourWrites = opts?.readYourWrites ?? true;
          const offline = opts?.offline ?? false;
          const remoteEncryptionKey = opts?.remoteEncryptionKey ?? "";
          this.db = databaseOpenWithSync(path, opts.syncUrl, authToken, encryptionCipher, encryptionKey, syncPeriod, readYourWrites, offline, remoteEncryptionKey);
        } else {
          const authToken2 = opts?.authToken ?? "";
          const encryptionKey = opts?.encryptionKey ?? "";
          const timeout = opts?.timeout ?? 0;
          const remoteEncryptionKey = opts?.remoteEncryptionKey ?? "";
          this.db = databaseOpen(path, authToken2, encryptionCipher, encryptionKey, timeout, remoteEncryptionKey);
        }
        this.memory = path === ":memory:";
        this.readonly = false;
        this.name = "";
        this.open = true;
        const db = this.db;
        Object.defineProperties(this, {
          inTransaction: {
            get() {
              return databaseInTransaction(db);
            }
          }
        });
      }
      sync() {
        return databaseSyncSync.call(this.db);
      }
      syncUntil(replicationIndex) {
        return databaseSyncUntilSync.call(this.db, replicationIndex);
      }
      /**
       * Prepares a SQL statement for execution.
       *
       * @param {string} sql - The SQL statement string to prepare.
       */
      prepare(sql2) {
        try {
          const stmt = databasePrepareSync.call(this.db, sql2);
          return new Statement(stmt);
        } catch (err) {
          throw convertError(err);
        }
      }
      /**
       * Returns a function that executes the given function in a transaction.
       *
       * @param {function} fn - The function to wrap in a transaction.
       */
      transaction(fn) {
        if (typeof fn !== "function")
          throw new TypeError("Expected first argument to be a function");
        const db = this;
        const wrapTxn = (mode) => {
          return (...bindParameters) => {
            db.exec("BEGIN " + mode);
            try {
              const result = fn(...bindParameters);
              db.exec("COMMIT");
              return result;
            } catch (err) {
              db.exec("ROLLBACK");
              throw err;
            }
          };
        };
        const properties = {
          default: { value: wrapTxn("") },
          deferred: { value: wrapTxn("DEFERRED") },
          immediate: { value: wrapTxn("IMMEDIATE") },
          exclusive: { value: wrapTxn("EXCLUSIVE") },
          database: { value: this, enumerable: true }
        };
        Object.defineProperties(properties.default.value, properties);
        Object.defineProperties(properties.deferred.value, properties);
        Object.defineProperties(properties.immediate.value, properties);
        Object.defineProperties(properties.exclusive.value, properties);
        return properties.default.value;
      }
      pragma(source, options) {
        if (options == null)
          options = {};
        if (typeof source !== "string")
          throw new TypeError("Expected first argument to be a string");
        if (typeof options !== "object")
          throw new TypeError("Expected second argument to be an options object");
        const simple = options["simple"];
        const stmt = this.prepare(`PRAGMA ${source}`, this, true);
        return simple ? stmt.pluck().get() : stmt.all();
      }
      backup(filename, options) {
        throw new Error("not implemented");
      }
      serialize(options) {
        throw new Error("not implemented");
      }
      function(name, options, fn) {
        if (options == null)
          options = {};
        if (typeof options === "function") {
          fn = options;
          options = {};
        }
        if (typeof name !== "string")
          throw new TypeError("Expected first argument to be a string");
        if (typeof fn !== "function")
          throw new TypeError("Expected last argument to be a function");
        if (typeof options !== "object")
          throw new TypeError("Expected second argument to be an options object");
        if (!name)
          throw new TypeError(
            "User-defined function name cannot be an empty string"
          );
        throw new Error("not implemented");
      }
      aggregate(name, options) {
        if (typeof name !== "string")
          throw new TypeError("Expected first argument to be a string");
        if (typeof options !== "object" || options === null)
          throw new TypeError("Expected second argument to be an options object");
        if (!name)
          throw new TypeError(
            "User-defined function name cannot be an empty string"
          );
        throw new Error("not implemented");
      }
      table(name, factory) {
        if (typeof name !== "string")
          throw new TypeError("Expected first argument to be a string");
        if (!name)
          throw new TypeError(
            "Virtual table module name cannot be an empty string"
          );
        throw new Error("not implemented");
      }
      authorizer(rules) {
        databaseAuthorizer.call(this.db, rules);
      }
      loadExtension(...args2) {
        databaseLoadExtension.call(this.db, ...args2);
      }
      maxWriteReplicationIndex() {
        return databaseMaxWriteReplicationIndex.call(this.db);
      }
      /**
       * Executes a SQL statement.
       *
       * @param {string} sql - The SQL statement string to execute.
       */
      exec(sql2) {
        try {
          databaseExecSync.call(this.db, sql2);
        } catch (err) {
          throw convertError(err);
        }
      }
      /**
       * Interrupts the database connection.
       */
      interrupt() {
        databaseInterrupt.call(this.db);
      }
      /**
       * Closes the database connection.
       */
      close() {
        databaseClose.call(this.db);
        this.open = false;
      }
      /**
       * Toggle 64-bit integer support.
       */
      defaultSafeIntegers(toggle) {
        databaseDefaultSafeIntegers.call(this.db, toggle ?? true);
        return this;
      }
      unsafeMode(...args2) {
        throw new Error("not implemented");
      }
    };
    var Statement = class {
      constructor(stmt) {
        this.stmt = stmt;
        this.pluckMode = false;
      }
      /**
       * Toggle raw mode.
       *
       * @param raw Enable or disable raw mode. If you don't pass the parameter, raw mode is enabled.
       */
      raw(raw) {
        statementRaw.call(this.stmt, raw ?? true);
        return this;
      }
      /**
       * Toggle pluck mode.
       *
       * @param pluckMode Enable or disable pluck mode. If you don't pass the parameter, pluck mode is enabled.
       */
      pluck(pluckMode) {
        this.pluckMode = pluckMode ?? true;
        return this;
      }
      get reader() {
        return statementIsReader.call(this.stmt);
      }
      /**
       * Executes the SQL statement and returns an info object.
       */
      run(...bindParameters) {
        try {
          if (bindParameters.length == 1 && typeof bindParameters[0] === "object") {
            return statementRun.call(this.stmt, bindParameters[0]);
          } else {
            return statementRun.call(this.stmt, bindParameters.flat());
          }
        } catch (err) {
          throw convertError(err);
        }
      }
      /**
       * Executes the SQL statement and returns the first row.
       *
       * @param bindParameters - The bind parameters for executing the statement.
       */
      get(...bindParameters) {
        try {
          if (bindParameters.length == 1 && typeof bindParameters[0] === "object") {
            return statementGet.call(this.stmt, bindParameters[0]);
          } else {
            return statementGet.call(this.stmt, bindParameters.flat());
          }
        } catch (err) {
          throw convertError(err);
        }
      }
      /**
       * Executes the SQL statement and returns an iterator to the resulting rows.
       *
       * @param bindParameters - The bind parameters for executing the statement.
       */
      iterate(...bindParameters) {
        var rows = void 0;
        if (bindParameters.length == 1 && typeof bindParameters[0] === "object") {
          rows = statementRowsSync.call(this.stmt, bindParameters[0]);
        } else {
          rows = statementRowsSync.call(this.stmt, bindParameters.flat());
        }
        const iter = {
          nextRows: Array(100),
          nextRowIndex: 100,
          next() {
            try {
              if (this.nextRowIndex === 100) {
                rowsNext.call(rows, this.nextRows);
                this.nextRowIndex = 0;
              }
              const row = this.nextRows[this.nextRowIndex];
              this.nextRows[this.nextRowIndex] = void 0;
              if (!row) {
                return { done: true };
              }
              this.nextRowIndex++;
              return { value: row, done: false };
            } catch (err) {
              throw convertError(err);
            }
          },
          [Symbol.iterator]() {
            return this;
          }
        };
        return iter;
      }
      /**
       * Executes the SQL statement and returns an array of the resulting rows.
       *
       * @param bindParameters - The bind parameters for executing the statement.
       */
      all(...bindParameters) {
        try {
          const result = [];
          for (const row of this.iterate(...bindParameters)) {
            if (this.pluckMode) {
              result.push(row[Object.keys(row)[0]]);
            } else {
              result.push(row);
            }
          }
          return result;
        } catch (err) {
          throw convertError(err);
        }
      }
      /**
       * Interrupts the statement.
       */
      interrupt() {
        statementInterrupt.call(this.stmt);
      }
      /**
       * Returns the columns in the result set returned by this prepared statement.
       */
      columns() {
        return statementColumns.call(this.stmt);
      }
      /**
       * Toggle 64-bit integer support.
       */
      safeIntegers(toggle) {
        statementSafeIntegers.call(this.stmt, toggle ?? true);
        return this;
      }
    };
    module2.exports = Database2;
    module2.exports.Authorization = Authorization;
    module2.exports.SqliteError = SqliteError;
  }
});

// node_modules/@libsql/client/lib-esm/sqlite3.js
function _createClient(config) {
  if (config.scheme !== "file") {
    throw new LibsqlError(`URL scheme ${JSON.stringify(config.scheme + ":")} is not supported by the local sqlite3 client. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
  }
  const authority = config.authority;
  if (authority !== void 0) {
    const host = authority.host.toLowerCase();
    if (host !== "" && host !== "localhost") {
      throw new LibsqlError(`Invalid host in file URL: ${JSON.stringify(authority.host)}. A "file:" URL with an absolute path should start with one slash ("file:/absolute/path.db") or with three slashes ("file:///absolute/path.db"). For more information, please read ${supportedUrlLink}`, "URL_INVALID");
    }
    if (authority.port !== void 0) {
      throw new LibsqlError("File URL cannot have a port", "URL_INVALID");
    }
    if (authority.userinfo !== void 0) {
      throw new LibsqlError("File URL cannot have username and password", "URL_INVALID");
    }
  }
  let isInMemory = isInMemoryConfig(config);
  if (isInMemory && config.syncUrl) {
    throw new LibsqlError(`Embedded replica must use file for local db but URI with in-memory mode were provided instead: ${config.path}`, "URL_INVALID");
  }
  let path = config.path;
  if (isInMemory) {
    path = `${config.scheme}:${config.path}`;
  }
  const options = {
    authToken: config.authToken,
    encryptionKey: config.encryptionKey,
    remoteEncryptionKey: config.remoteEncryptionKey,
    syncUrl: config.syncUrl,
    syncPeriod: config.syncInterval,
    readYourWrites: config.readYourWrites,
    offline: config.offline
  };
  const db = new import_libsql.default(path, options);
  executeStmt(db, "SELECT 1 AS checkThatTheDatabaseCanBeOpened", config.intMode);
  return new Sqlite3Client(path, options, db, config.intMode);
}
function executeStmt(db, stmt, intMode) {
  let sql2;
  let args2;
  if (typeof stmt === "string") {
    sql2 = stmt;
    args2 = [];
  } else {
    sql2 = stmt.sql;
    if (Array.isArray(stmt.args)) {
      args2 = stmt.args.map((value) => valueToSql(value, intMode));
    } else {
      args2 = {};
      for (const name in stmt.args) {
        const argName = name[0] === "@" || name[0] === "$" || name[0] === ":" ? name.substring(1) : name;
        args2[argName] = valueToSql(stmt.args[name], intMode);
      }
    }
  }
  try {
    const sqlStmt = db.prepare(sql2);
    sqlStmt.safeIntegers(true);
    let returnsData = true;
    try {
      sqlStmt.raw(true);
    } catch {
      returnsData = false;
    }
    if (returnsData) {
      const columns = Array.from(sqlStmt.columns().map((col) => col.name));
      const columnTypes = Array.from(sqlStmt.columns().map((col) => col.type ?? ""));
      const rows = sqlStmt.all(args2).map((sqlRow) => {
        return rowFromSql(sqlRow, columns, intMode);
      });
      const rowsAffected = 0;
      const lastInsertRowid = void 0;
      return new ResultSetImpl(columns, columnTypes, rows, rowsAffected, lastInsertRowid);
    } else {
      const info = sqlStmt.run(args2);
      const rowsAffected = info.changes;
      const lastInsertRowid = BigInt(info.lastInsertRowid);
      return new ResultSetImpl([], [], [], rowsAffected, lastInsertRowid);
    }
  } catch (e) {
    throw mapSqliteError(e);
  }
}
function rowFromSql(sqlRow, columns, intMode) {
  const row = {};
  Object.defineProperty(row, "length", { value: sqlRow.length });
  for (let i = 0; i < sqlRow.length; ++i) {
    const value = valueFromSql(sqlRow[i], intMode);
    Object.defineProperty(row, i, { value });
    const column = columns[i];
    if (!Object.hasOwn(row, column)) {
      Object.defineProperty(row, column, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    }
  }
  return row;
}
function valueFromSql(sqlValue, intMode) {
  if (typeof sqlValue === "bigint") {
    if (intMode === "number") {
      if (sqlValue < minSafeBigint || sqlValue > maxSafeBigint) {
        throw new RangeError("Received integer which cannot be safely represented as a JavaScript number");
      }
      return Number(sqlValue);
    } else if (intMode === "bigint") {
      return sqlValue;
    } else if (intMode === "string") {
      return "" + sqlValue;
    } else {
      throw new Error("Invalid value for IntMode");
    }
  } else if (sqlValue instanceof import_node_buffer.Buffer) {
    return sqlValue.buffer;
  }
  return sqlValue;
}
function valueToSql(value, intMode) {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new RangeError("Only finite numbers (not Infinity or NaN) can be passed as arguments");
    }
    return value;
  } else if (typeof value === "bigint") {
    if (value < minInteger || value > maxInteger) {
      throw new RangeError("bigint is too large to be represented as a 64-bit integer and passed as argument");
    }
    return value;
  } else if (typeof value === "boolean") {
    switch (intMode) {
      case "bigint":
        return value ? 1n : 0n;
      case "string":
        return value ? "1" : "0";
      default:
        return value ? 1 : 0;
    }
  } else if (value instanceof ArrayBuffer) {
    return import_node_buffer.Buffer.from(value);
  } else if (value instanceof Date) {
    return value.valueOf();
  } else if (value === void 0) {
    throw new TypeError("undefined cannot be passed as argument to the database");
  } else {
    return value;
  }
}
function executeMultiple(db, sql2) {
  try {
    db.exec(sql2);
  } catch (e) {
    throw mapSqliteError(e);
  }
}
function mapSqliteError(e) {
  if (e instanceof import_libsql.default.SqliteError) {
    const extendedCode = e.code;
    const code = mapToBaseCode(e.rawCode);
    return new LibsqlError(e.message, code, extendedCode, e.rawCode, e);
  }
  return e;
}
function mapToBaseCode(rawCode) {
  if (rawCode === void 0) {
    return "SQLITE_UNKNOWN";
  }
  const baseCode = rawCode & 255;
  return sqliteErrorCodes[baseCode] ?? `SQLITE_UNKNOWN_${baseCode.toString()}`;
}
var import_libsql, import_node_buffer, Sqlite3Client, Sqlite3Transaction, minSafeBigint, maxSafeBigint, minInteger, maxInteger, sqliteErrorCodes;
var init_sqlite3 = __esm({
  "node_modules/@libsql/client/lib-esm/sqlite3.js"() {
    import_libsql = __toESM(require_libsql(), 1);
    import_node_buffer = require("node:buffer");
    init_api();
    init_config();
    init_util();
    init_api();
    Sqlite3Client = class {
      #path;
      #options;
      #db;
      #intMode;
      closed;
      protocol;
      /** @private */
      constructor(path, options, db, intMode) {
        this.#path = path;
        this.#options = options;
        this.#db = db;
        this.#intMode = intMode;
        this.closed = false;
        this.protocol = "file";
      }
      async execute(stmtOrSql, args2) {
        let stmt;
        if (typeof stmtOrSql === "string") {
          stmt = {
            sql: stmtOrSql,
            args: args2 || []
          };
        } else {
          stmt = stmtOrSql;
        }
        this.#checkNotClosed();
        return executeStmt(this.#getDb(), stmt, this.#intMode);
      }
      async batch(stmts, mode = "deferred") {
        this.#checkNotClosed();
        const db = this.#getDb();
        try {
          executeStmt(db, transactionModeToBegin(mode), this.#intMode);
          const resultSets = [];
          for (let i = 0; i < stmts.length; i++) {
            try {
              if (!db.inTransaction) {
                throw new LibsqlBatchError("The transaction has been rolled back", i, "TRANSACTION_CLOSED");
              }
              const stmt = stmts[i];
              const normalizedStmt = Array.isArray(stmt) ? { sql: stmt[0], args: stmt[1] || [] } : stmt;
              resultSets.push(executeStmt(db, normalizedStmt, this.#intMode));
            } catch (e) {
              if (e instanceof LibsqlBatchError) {
                throw e;
              }
              if (e instanceof LibsqlError) {
                throw new LibsqlBatchError(e.message, i, e.code, e.extendedCode, e.rawCode, e.cause instanceof Error ? e.cause : void 0);
              }
              throw e;
            }
          }
          executeStmt(db, "COMMIT", this.#intMode);
          return resultSets;
        } finally {
          if (db.inTransaction) {
            executeStmt(db, "ROLLBACK", this.#intMode);
          }
        }
      }
      async migrate(stmts) {
        this.#checkNotClosed();
        const db = this.#getDb();
        try {
          executeStmt(db, "PRAGMA foreign_keys=off", this.#intMode);
          executeStmt(db, transactionModeToBegin("deferred"), this.#intMode);
          const resultSets = [];
          for (let i = 0; i < stmts.length; i++) {
            try {
              if (!db.inTransaction) {
                throw new LibsqlBatchError("The transaction has been rolled back", i, "TRANSACTION_CLOSED");
              }
              resultSets.push(executeStmt(db, stmts[i], this.#intMode));
            } catch (e) {
              if (e instanceof LibsqlBatchError) {
                throw e;
              }
              if (e instanceof LibsqlError) {
                throw new LibsqlBatchError(e.message, i, e.code, e.extendedCode, e.rawCode, e.cause instanceof Error ? e.cause : void 0);
              }
              throw e;
            }
          }
          executeStmt(db, "COMMIT", this.#intMode);
          return resultSets;
        } finally {
          if (db.inTransaction) {
            executeStmt(db, "ROLLBACK", this.#intMode);
          }
          executeStmt(db, "PRAGMA foreign_keys=on", this.#intMode);
        }
      }
      async transaction(mode = "write") {
        const db = this.#getDb();
        executeStmt(db, transactionModeToBegin(mode), this.#intMode);
        this.#db = null;
        return new Sqlite3Transaction(db, this.#intMode);
      }
      async executeMultiple(sql2) {
        this.#checkNotClosed();
        const db = this.#getDb();
        try {
          return executeMultiple(db, sql2);
        } finally {
          if (db.inTransaction) {
            executeStmt(db, "ROLLBACK", this.#intMode);
          }
        }
      }
      async sync() {
        this.#checkNotClosed();
        const rep = await this.#getDb().sync();
        return {
          frames_synced: rep.frames_synced,
          frame_no: rep.frame_no
        };
      }
      async reconnect() {
        try {
          if (!this.closed && this.#db !== null) {
            this.#db.close();
          }
        } finally {
          this.#db = new import_libsql.default(this.#path, this.#options);
          this.closed = false;
        }
      }
      close() {
        this.closed = true;
        if (this.#db !== null) {
          this.#db.close();
          this.#db = null;
        }
      }
      #checkNotClosed() {
        if (this.closed) {
          throw new LibsqlError("The client is closed", "CLIENT_CLOSED");
        }
      }
      // Lazily creates the database connection and returns it
      #getDb() {
        if (this.#db === null) {
          this.#db = new import_libsql.default(this.#path, this.#options);
        }
        return this.#db;
      }
    };
    Sqlite3Transaction = class {
      #database;
      #intMode;
      /** @private */
      constructor(database, intMode) {
        this.#database = database;
        this.#intMode = intMode;
      }
      async execute(stmtOrSql, args2) {
        let stmt;
        if (typeof stmtOrSql === "string") {
          stmt = {
            sql: stmtOrSql,
            args: args2 || []
          };
        } else {
          stmt = stmtOrSql;
        }
        this.#checkNotClosed();
        return executeStmt(this.#database, stmt, this.#intMode);
      }
      async batch(stmts) {
        const resultSets = [];
        for (let i = 0; i < stmts.length; i++) {
          try {
            this.#checkNotClosed();
            const stmt = stmts[i];
            const normalizedStmt = Array.isArray(stmt) ? { sql: stmt[0], args: stmt[1] || [] } : stmt;
            resultSets.push(executeStmt(this.#database, normalizedStmt, this.#intMode));
          } catch (e) {
            if (e instanceof LibsqlBatchError) {
              throw e;
            }
            if (e instanceof LibsqlError) {
              throw new LibsqlBatchError(e.message, i, e.code, e.extendedCode, e.rawCode, e.cause instanceof Error ? e.cause : void 0);
            }
            throw e;
          }
        }
        return resultSets;
      }
      async executeMultiple(sql2) {
        this.#checkNotClosed();
        return executeMultiple(this.#database, sql2);
      }
      async rollback() {
        if (!this.#database.open) {
          return;
        }
        this.#checkNotClosed();
        executeStmt(this.#database, "ROLLBACK", this.#intMode);
      }
      async commit() {
        this.#checkNotClosed();
        executeStmt(this.#database, "COMMIT", this.#intMode);
      }
      close() {
        if (this.#database.inTransaction) {
          executeStmt(this.#database, "ROLLBACK", this.#intMode);
        }
      }
      get closed() {
        return !this.#database.inTransaction;
      }
      #checkNotClosed() {
        if (this.closed) {
          throw new LibsqlError("The transaction is closed", "TRANSACTION_CLOSED");
        }
      }
    };
    minSafeBigint = -9007199254740991n;
    maxSafeBigint = 9007199254740991n;
    minInteger = -9223372036854775808n;
    maxInteger = 9223372036854775807n;
    sqliteErrorCodes = {
      1: "SQLITE_ERROR",
      2: "SQLITE_INTERNAL",
      3: "SQLITE_PERM",
      4: "SQLITE_ABORT",
      5: "SQLITE_BUSY",
      6: "SQLITE_LOCKED",
      7: "SQLITE_NOMEM",
      8: "SQLITE_READONLY",
      9: "SQLITE_INTERRUPT",
      10: "SQLITE_IOERR",
      11: "SQLITE_CORRUPT",
      12: "SQLITE_NOTFOUND",
      13: "SQLITE_FULL",
      14: "SQLITE_CANTOPEN",
      15: "SQLITE_PROTOCOL",
      16: "SQLITE_EMPTY",
      17: "SQLITE_SCHEMA",
      18: "SQLITE_TOOBIG",
      19: "SQLITE_CONSTRAINT",
      20: "SQLITE_MISMATCH",
      21: "SQLITE_MISUSE",
      22: "SQLITE_NOLFS",
      23: "SQLITE_AUTH",
      24: "SQLITE_FORMAT",
      25: "SQLITE_RANGE",
      26: "SQLITE_NOTADB",
      27: "SQLITE_NOTICE",
      28: "SQLITE_WARNING"
    };
  }
});

// node_modules/ws/lib/constants.js
var require_constants = __commonJS({
  "node_modules/ws/lib/constants.js"(exports2, module2) {
    "use strict";
    var BINARY_TYPES = ["nodebuffer", "arraybuffer", "fragments"];
    var hasBlob = typeof Blob !== "undefined";
    if (hasBlob)
      BINARY_TYPES.push("blob");
    module2.exports = {
      BINARY_TYPES,
      CLOSE_TIMEOUT: 3e4,
      EMPTY_BUFFER: Buffer.alloc(0),
      GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
      hasBlob,
      kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
      kListener: Symbol("kListener"),
      kStatusCode: Symbol("status-code"),
      kWebSocket: Symbol("websocket"),
      NOOP: () => {
      }
    };
  }
});

// node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "node_modules/ws/lib/buffer-util.js"(exports2, module2) {
    "use strict";
    var { EMPTY_BUFFER } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    function concat(list, totalLength) {
      if (list.length === 0)
        return EMPTY_BUFFER;
      if (list.length === 1)
        return list[0];
      const target = Buffer.allocUnsafe(totalLength);
      let offset = 0;
      for (let i = 0; i < list.length; i++) {
        const buf = list[i];
        target.set(buf, offset);
        offset += buf.length;
      }
      if (offset < totalLength) {
        return new FastBuffer(target.buffer, target.byteOffset, offset);
      }
      return target;
    }
    function _mask(source, mask, output, offset, length) {
      for (let i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask[i & 3];
      }
    }
    function _unmask(buffer, mask) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= mask[i & 3];
      }
    }
    function toArrayBuffer(buf) {
      if (buf.length === buf.buffer.byteLength) {
        return buf.buffer;
      }
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
    }
    function toBuffer(data) {
      toBuffer.readOnly = true;
      if (Buffer.isBuffer(data))
        return data;
      let buf;
      if (data instanceof ArrayBuffer) {
        buf = new FastBuffer(data);
      } else if (ArrayBuffer.isView(data)) {
        buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
      } else {
        buf = Buffer.from(data);
        toBuffer.readOnly = false;
      }
      return buf;
    }
    module2.exports = {
      concat,
      mask: _mask,
      toArrayBuffer,
      toBuffer,
      unmask: _unmask
    };
    if (!process.env.WS_NO_BUFFER_UTIL) {
      try {
        const bufferUtil = require("bufferutil");
        module2.exports.mask = function(source, mask, output, offset, length) {
          if (length < 48)
            _mask(source, mask, output, offset, length);
          else
            bufferUtil.mask(source, mask, output, offset, length);
        };
        module2.exports.unmask = function(buffer, mask) {
          if (buffer.length < 32)
            _unmask(buffer, mask);
          else
            bufferUtil.unmask(buffer, mask);
        };
      } catch (e) {
      }
    }
  }
});

// node_modules/ws/lib/limiter.js
var require_limiter = __commonJS({
  "node_modules/ws/lib/limiter.js"(exports2, module2) {
    "use strict";
    var kDone = Symbol("kDone");
    var kRun = Symbol("kRun");
    var Limiter = class {
      /**
       * Creates a new `Limiter`.
       *
       * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
       *     to run concurrently
       */
      constructor(concurrency) {
        this[kDone] = () => {
          this.pending--;
          this[kRun]();
        };
        this.concurrency = concurrency || Infinity;
        this.jobs = [];
        this.pending = 0;
      }
      /**
       * Adds a job to the queue.
       *
       * @param {Function} job The job to run
       * @public
       */
      add(job) {
        this.jobs.push(job);
        this[kRun]();
      }
      /**
       * Removes a job from the queue and runs it if possible.
       *
       * @private
       */
      [kRun]() {
        if (this.pending === this.concurrency)
          return;
        if (this.jobs.length) {
          const job = this.jobs.shift();
          this.pending++;
          job(this[kDone]);
        }
      }
    };
    module2.exports = Limiter;
  }
});

// node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "node_modules/ws/lib/permessage-deflate.js"(exports2, module2) {
    "use strict";
    var zlib = require("zlib");
    var bufferUtil = require_buffer_util();
    var Limiter = require_limiter();
    var { kStatusCode } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    var TRAILER = Buffer.from([0, 0, 255, 255]);
    var kPerMessageDeflate = Symbol("permessage-deflate");
    var kTotalLength = Symbol("total-length");
    var kCallback = Symbol("callback");
    var kBuffers = Symbol("buffers");
    var kError = Symbol("error");
    var zlibLimiter;
    var PerMessageDeflate2 = class {
      /**
       * Creates a PerMessageDeflate instance.
       *
       * @param {Object} [options] Configuration options
       * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
       *     for, or request, a custom client window size
       * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
       *     acknowledge disabling of client context takeover
       * @param {Number} [options.concurrencyLimit=10] The number of concurrent
       *     calls to zlib
       * @param {Boolean} [options.isServer=false] Create the instance in either
       *     server or client mode
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
       *     use of a custom server window size
       * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
       *     disabling of server context takeover
       * @param {Number} [options.threshold=1024] Size (in bytes) below which
       *     messages should not be compressed if context takeover is disabled
       * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
       *     deflate
       * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
       *     inflate
       */
      constructor(options) {
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._maxPayload = this._options.maxPayload | 0;
        this._isServer = !!this._options.isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter(concurrency);
        }
      }
      /**
       * @type {String}
       */
      static get extensionName() {
        return "permessage-deflate";
      }
      /**
       * Create an extension negotiation offer.
       *
       * @return {Object} Extension parameters
       * @public
       */
      offer() {
        const params = {};
        if (this._options.serverNoContextTakeover) {
          params.server_no_context_takeover = true;
        }
        if (this._options.clientNoContextTakeover) {
          params.client_no_context_takeover = true;
        }
        if (this._options.serverMaxWindowBits) {
          params.server_max_window_bits = this._options.serverMaxWindowBits;
        }
        if (this._options.clientMaxWindowBits) {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        } else if (this._options.clientMaxWindowBits == null) {
          params.client_max_window_bits = true;
        }
        return params;
      }
      /**
       * Accept an extension negotiation offer/response.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Object} Accepted configuration
       * @public
       */
      accept(configurations) {
        configurations = this.normalizeParams(configurations);
        this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
        return this.params;
      }
      /**
       * Releases all resources used by the extension.
       *
       * @public
       */
      cleanup() {
        if (this._inflate) {
          this._inflate.close();
          this._inflate = null;
        }
        if (this._deflate) {
          const callback = this._deflate[kCallback];
          this._deflate.close();
          this._deflate = null;
          if (callback) {
            callback(
              new Error(
                "The deflate stream was closed while data was being processed"
              )
            );
          }
        }
      }
      /**
       *  Accept an extension negotiation offer.
       *
       * @param {Array} offers The extension negotiation offers
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsServer(offers) {
        const opts = this._options;
        const accepted = offers.find((params) => {
          if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && !params.client_max_window_bits) {
            return false;
          }
          return true;
        });
        if (!accepted) {
          throw new Error("None of the extension offers can be accepted");
        }
        if (opts.serverNoContextTakeover) {
          accepted.server_no_context_takeover = true;
        }
        if (opts.clientNoContextTakeover) {
          accepted.client_no_context_takeover = true;
        }
        if (typeof opts.serverMaxWindowBits === "number") {
          accepted.server_max_window_bits = opts.serverMaxWindowBits;
        }
        if (typeof opts.clientMaxWindowBits === "number") {
          accepted.client_max_window_bits = opts.clientMaxWindowBits;
        } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
          delete accepted.client_max_window_bits;
        }
        return accepted;
      }
      /**
       * Accept the extension negotiation response.
       *
       * @param {Array} response The extension negotiation response
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsClient(response) {
        const params = response[0];
        if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        }
        if (!params.client_max_window_bits) {
          if (typeof this._options.clientMaxWindowBits === "number") {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          }
        } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
          throw new Error(
            'Unexpected or invalid parameter "client_max_window_bits"'
          );
        }
        return params;
      }
      /**
       * Normalize parameters.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Array} The offers/response with normalized parameters
       * @private
       */
      normalizeParams(configurations) {
        configurations.forEach((params) => {
          Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value = value[0];
            if (key === "client_max_window_bits") {
              if (value !== true) {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`
                  );
                }
                value = num;
              } else if (!this._isServer) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else if (key === "server_max_window_bits") {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
              value = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value !== true) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value;
          });
        });
        return configurations;
      }
      /**
       * Decompress data. Concurrency limited.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      decompress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._decompress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Compress data. Concurrency limited.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      compress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._compress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Decompress data.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _decompress(data, fin, callback) {
        const endpoint = this._isServer ? "client" : "server";
        if (!this._inflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._inflate = zlib.createInflateRaw({
            ...this._options.zlibInflateOptions,
            windowBits
          });
          this._inflate[kPerMessageDeflate] = this;
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          this._inflate.on("error", inflateOnError);
          this._inflate.on("data", inflateOnData);
        }
        this._inflate[kCallback] = callback;
        this._inflate.write(data);
        if (fin)
          this._inflate.write(TRAILER);
        this._inflate.flush(() => {
          const err = this._inflate[kError];
          if (err) {
            this._inflate.close();
            this._inflate = null;
            callback(err);
            return;
          }
          const data2 = bufferUtil.concat(
            this._inflate[kBuffers],
            this._inflate[kTotalLength]
          );
          if (this._inflate._readableState.endEmitted) {
            this._inflate.close();
            this._inflate = null;
          } else {
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._inflate.reset();
            }
          }
          callback(null, data2);
        });
      }
      /**
       * Compress data.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _compress(data, fin, callback) {
        const endpoint = this._isServer ? "server" : "client";
        if (!this._deflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._deflate = zlib.createDeflateRaw({
            ...this._options.zlibDeflateOptions,
            windowBits
          });
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          this._deflate.on("data", deflateOnData);
        }
        this._deflate[kCallback] = callback;
        this._deflate.write(data);
        this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
          if (!this._deflate) {
            return;
          }
          let data2 = bufferUtil.concat(
            this._deflate[kBuffers],
            this._deflate[kTotalLength]
          );
          if (fin) {
            data2 = new FastBuffer(data2.buffer, data2.byteOffset, data2.length - 4);
          }
          this._deflate[kCallback] = null;
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._deflate.reset();
          }
          callback(null, data2);
        });
      }
    };
    module2.exports = PerMessageDeflate2;
    function deflateOnData(chunk) {
      this[kBuffers].push(chunk);
      this[kTotalLength] += chunk.length;
    }
    function inflateOnData(chunk) {
      this[kTotalLength] += chunk.length;
      if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
        this[kBuffers].push(chunk);
        return;
      }
      this[kError] = new RangeError("Max payload size exceeded");
      this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
      this[kError][kStatusCode] = 1009;
      this.removeListener("data", inflateOnData);
      this.reset();
    }
    function inflateOnError(err) {
      this[kPerMessageDeflate]._inflate = null;
      if (this[kError]) {
        this[kCallback](this[kError]);
        return;
      }
      err[kStatusCode] = 1007;
      this[kCallback](err);
    }
  }
});

// node_modules/ws/lib/validation.js
var require_validation = __commonJS({
  "node_modules/ws/lib/validation.js"(exports2, module2) {
    "use strict";
    var { isUtf8 } = require("buffer");
    var { hasBlob } = require_constants();
    var tokenChars = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 0 - 15
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 16 - 31
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      // 32 - 47
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      // 48 - 63
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 64 - 79
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      // 80 - 95
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 96 - 111
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0
      // 112 - 127
    ];
    function isValidStatusCode(code) {
      return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
    }
    function _isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || // Overlong
          buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || // Overlong
          buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    function isBlob(value) {
      return hasBlob && typeof value === "object" && typeof value.arrayBuffer === "function" && typeof value.type === "string" && typeof value.stream === "function" && (value[Symbol.toStringTag] === "Blob" || value[Symbol.toStringTag] === "File");
    }
    module2.exports = {
      isBlob,
      isValidStatusCode,
      isValidUTF8: _isValidUTF8,
      tokenChars
    };
    if (isUtf8) {
      module2.exports.isValidUTF8 = function(buf) {
        return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
      };
    } else if (!process.env.WS_NO_UTF_8_VALIDATE) {
      try {
        const isValidUTF8 = require("utf-8-validate");
        module2.exports.isValidUTF8 = function(buf) {
          return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
        };
      } catch (e) {
      }
    }
  }
});

// node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({
  "node_modules/ws/lib/receiver.js"(exports2, module2) {
    "use strict";
    var { Writable } = require("stream");
    var PerMessageDeflate2 = require_permessage_deflate();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      kStatusCode,
      kWebSocket
    } = require_constants();
    var { concat, toArrayBuffer, unmask } = require_buffer_util();
    var { isValidStatusCode, isValidUTF8 } = require_validation();
    var FastBuffer = Buffer[Symbol.species];
    var GET_INFO = 0;
    var GET_PAYLOAD_LENGTH_16 = 1;
    var GET_PAYLOAD_LENGTH_64 = 2;
    var GET_MASK = 3;
    var GET_DATA = 4;
    var INFLATING = 5;
    var DEFER_EVENT = 6;
    var Receiver2 = class extends Writable {
      /**
       * Creates a Receiver instance.
       *
       * @param {Object} [options] Options object
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {String} [options.binaryType=nodebuffer] The type for binary data
       * @param {Object} [options.extensions] An object containing the negotiated
       *     extensions
       * @param {Boolean} [options.isServer=false] Specifies whether to operate in
       *     client or server mode
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       */
      constructor(options = {}) {
        super();
        this._allowSynchronousEvents = options.allowSynchronousEvents !== void 0 ? options.allowSynchronousEvents : true;
        this._binaryType = options.binaryType || BINARY_TYPES[0];
        this._extensions = options.extensions || {};
        this._isServer = !!options.isServer;
        this._maxPayload = options.maxPayload | 0;
        this._skipUTF8Validation = !!options.skipUTF8Validation;
        this[kWebSocket] = void 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._mask = void 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragments = [];
        this._errored = false;
        this._loop = false;
        this._state = GET_INFO;
      }
      /**
       * Implements `Writable.prototype._write()`.
       *
       * @param {Buffer} chunk The chunk of data to write
       * @param {String} encoding The character encoding of `chunk`
       * @param {Function} cb Callback
       * @private
       */
      _write(chunk, encoding, cb) {
        if (this._opcode === 8 && this._state == GET_INFO)
          return cb();
        this._bufferedBytes += chunk.length;
        this._buffers.push(chunk);
        this.startLoop(cb);
      }
      /**
       * Consumes `n` bytes from the buffered data.
       *
       * @param {Number} n The number of bytes to consume
       * @return {Buffer} The consumed bytes
       * @private
       */
      consume(n) {
        this._bufferedBytes -= n;
        if (n === this._buffers[0].length)
          return this._buffers.shift();
        if (n < this._buffers[0].length) {
          const buf = this._buffers[0];
          this._buffers[0] = new FastBuffer(
            buf.buffer,
            buf.byteOffset + n,
            buf.length - n
          );
          return new FastBuffer(buf.buffer, buf.byteOffset, n);
        }
        const dst = Buffer.allocUnsafe(n);
        do {
          const buf = this._buffers[0];
          const offset = dst.length - n;
          if (n >= buf.length) {
            dst.set(this._buffers.shift(), offset);
          } else {
            dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
            this._buffers[0] = new FastBuffer(
              buf.buffer,
              buf.byteOffset + n,
              buf.length - n
            );
          }
          n -= buf.length;
        } while (n > 0);
        return dst;
      }
      /**
       * Starts the parsing loop.
       *
       * @param {Function} cb Callback
       * @private
       */
      startLoop(cb) {
        this._loop = true;
        do {
          switch (this._state) {
            case GET_INFO:
              this.getInfo(cb);
              break;
            case GET_PAYLOAD_LENGTH_16:
              this.getPayloadLength16(cb);
              break;
            case GET_PAYLOAD_LENGTH_64:
              this.getPayloadLength64(cb);
              break;
            case GET_MASK:
              this.getMask();
              break;
            case GET_DATA:
              this.getData(cb);
              break;
            case INFLATING:
            case DEFER_EVENT:
              this._loop = false;
              return;
          }
        } while (this._loop);
        if (!this._errored)
          cb();
      }
      /**
       * Reads the first two bytes of a frame.
       *
       * @param {Function} cb Callback
       * @private
       */
      getInfo(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        const buf = this.consume(2);
        if ((buf[0] & 48) !== 0) {
          const error = this.createError(
            RangeError,
            "RSV2 and RSV3 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_2_3"
          );
          cb(error);
          return;
        }
        const compressed = (buf[0] & 64) === 64;
        if (compressed && !this._extensions[PerMessageDeflate2.extensionName]) {
          const error = this.createError(
            RangeError,
            "RSV1 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
          cb(error);
          return;
        }
        this._fin = (buf[0] & 128) === 128;
        this._opcode = buf[0] & 15;
        this._payloadLength = buf[1] & 127;
        if (this._opcode === 0) {
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (!this._fragmented) {
            const error = this.createError(
              RangeError,
              "invalid opcode 0",
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            const error = this.createError(
              RangeError,
              `invalid opcode ${this._opcode}`,
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._compressed = compressed;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            const error = this.createError(
              RangeError,
              "FIN must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_FIN"
            );
            cb(error);
            return;
          }
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
            const error = this.createError(
              RangeError,
              `invalid payload length ${this._payloadLength}`,
              true,
              1002,
              "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
            );
            cb(error);
            return;
          }
        } else {
          const error = this.createError(
            RangeError,
            `invalid opcode ${this._opcode}`,
            true,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
          cb(error);
          return;
        }
        if (!this._fin && !this._fragmented)
          this._fragmented = this._opcode;
        this._masked = (buf[1] & 128) === 128;
        if (this._isServer) {
          if (!this._masked) {
            const error = this.createError(
              RangeError,
              "MASK must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_MASK"
            );
            cb(error);
            return;
          }
        } else if (this._masked) {
          const error = this.createError(
            RangeError,
            "MASK must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_MASK"
          );
          cb(error);
          return;
        }
        if (this._payloadLength === 126)
          this._state = GET_PAYLOAD_LENGTH_16;
        else if (this._payloadLength === 127)
          this._state = GET_PAYLOAD_LENGTH_64;
        else
          this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+16).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength16(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        this._payloadLength = this.consume(2).readUInt16BE(0);
        this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+64).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength64(cb) {
        if (this._bufferedBytes < 8) {
          this._loop = false;
          return;
        }
        const buf = this.consume(8);
        const num = buf.readUInt32BE(0);
        if (num > Math.pow(2, 53 - 32) - 1) {
          const error = this.createError(
            RangeError,
            "Unsupported WebSocket frame: payload length > 2^53 - 1",
            false,
            1009,
            "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
          );
          cb(error);
          return;
        }
        this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        this.haveLength(cb);
      }
      /**
       * Payload length has been read.
       *
       * @param {Function} cb Callback
       * @private
       */
      haveLength(cb) {
        if (this._payloadLength && this._opcode < 8) {
          this._totalPayloadLength += this._payloadLength;
          if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
            const error = this.createError(
              RangeError,
              "Max payload size exceeded",
              false,
              1009,
              "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
            );
            cb(error);
            return;
          }
        }
        if (this._masked)
          this._state = GET_MASK;
        else
          this._state = GET_DATA;
      }
      /**
       * Reads mask bytes.
       *
       * @private
       */
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = false;
          return;
        }
        this._mask = this.consume(4);
        this._state = GET_DATA;
      }
      /**
       * Reads data bytes.
       *
       * @param {Function} cb Callback
       * @private
       */
      getData(cb) {
        let data = EMPTY_BUFFER;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = false;
            return;
          }
          data = this.consume(this._payloadLength);
          if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) {
            unmask(data, this._mask);
          }
        }
        if (this._opcode > 7) {
          this.controlMessage(data, cb);
          return;
        }
        if (this._compressed) {
          this._state = INFLATING;
          this.decompress(data, cb);
          return;
        }
        if (data.length) {
          this._messageLength = this._totalPayloadLength;
          this._fragments.push(data);
        }
        this.dataMessage(cb);
      }
      /**
       * Decompresses data.
       *
       * @param {Buffer} data Compressed data
       * @param {Function} cb Callback
       * @private
       */
      decompress(data, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        perMessageDeflate.decompress(data, this._fin, (err, buf) => {
          if (err)
            return cb(err);
          if (buf.length) {
            this._messageLength += buf.length;
            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
              const error = this.createError(
                RangeError,
                "Max payload size exceeded",
                false,
                1009,
                "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
              );
              cb(error);
              return;
            }
            this._fragments.push(buf);
          }
          this.dataMessage(cb);
          if (this._state === GET_INFO)
            this.startLoop(cb);
        });
      }
      /**
       * Handles a data message.
       *
       * @param {Function} cb Callback
       * @private
       */
      dataMessage(cb) {
        if (!this._fin) {
          this._state = GET_INFO;
          return;
        }
        const messageLength = this._messageLength;
        const fragments = this._fragments;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragmented = 0;
        this._fragments = [];
        if (this._opcode === 2) {
          let data;
          if (this._binaryType === "nodebuffer") {
            data = concat(fragments, messageLength);
          } else if (this._binaryType === "arraybuffer") {
            data = toArrayBuffer(concat(fragments, messageLength));
          } else if (this._binaryType === "blob") {
            data = new Blob(fragments);
          } else {
            data = fragments;
          }
          if (this._allowSynchronousEvents) {
            this.emit("message", data, true);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", data, true);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        } else {
          const buf = concat(fragments, messageLength);
          if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
            const error = this.createError(
              Error,
              "invalid UTF-8 sequence",
              true,
              1007,
              "WS_ERR_INVALID_UTF8"
            );
            cb(error);
            return;
          }
          if (this._state === INFLATING || this._allowSynchronousEvents) {
            this.emit("message", buf, false);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", buf, false);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        }
      }
      /**
       * Handles a control message.
       *
       * @param {Buffer} data Data to handle
       * @return {(Error|RangeError|undefined)} A possible error
       * @private
       */
      controlMessage(data, cb) {
        if (this._opcode === 8) {
          if (data.length === 0) {
            this._loop = false;
            this.emit("conclude", 1005, EMPTY_BUFFER);
            this.end();
          } else {
            const code = data.readUInt16BE(0);
            if (!isValidStatusCode(code)) {
              const error = this.createError(
                RangeError,
                `invalid status code ${code}`,
                true,
                1002,
                "WS_ERR_INVALID_CLOSE_CODE"
              );
              cb(error);
              return;
            }
            const buf = new FastBuffer(
              data.buffer,
              data.byteOffset + 2,
              data.length - 2
            );
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              const error = this.createError(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
              cb(error);
              return;
            }
            this._loop = false;
            this.emit("conclude", code, buf);
            this.end();
          }
          this._state = GET_INFO;
          return;
        }
        if (this._allowSynchronousEvents) {
          this.emit(this._opcode === 9 ? "ping" : "pong", data);
          this._state = GET_INFO;
        } else {
          this._state = DEFER_EVENT;
          setImmediate(() => {
            this.emit(this._opcode === 9 ? "ping" : "pong", data);
            this._state = GET_INFO;
            this.startLoop(cb);
          });
        }
      }
      /**
       * Builds an error object.
       *
       * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
       * @param {String} message The error message
       * @param {Boolean} prefix Specifies whether or not to add a default prefix to
       *     `message`
       * @param {Number} statusCode The status code
       * @param {String} errorCode The exposed error code
       * @return {(Error|RangeError)} The error
       * @private
       */
      createError(ErrorCtor, message, prefix, statusCode, errorCode) {
        this._loop = false;
        this._errored = true;
        const err = new ErrorCtor(
          prefix ? `Invalid WebSocket frame: ${message}` : message
        );
        Error.captureStackTrace(err, this.createError);
        err.code = errorCode;
        err[kStatusCode] = statusCode;
        return err;
      }
    };
    module2.exports = Receiver2;
  }
});

// node_modules/ws/lib/sender.js
var require_sender = __commonJS({
  "node_modules/ws/lib/sender.js"(exports2, module2) {
    "use strict";
    var { Duplex } = require("stream");
    var { randomFillSync } = require("crypto");
    var PerMessageDeflate2 = require_permessage_deflate();
    var { EMPTY_BUFFER, kWebSocket, NOOP } = require_constants();
    var { isBlob, isValidStatusCode } = require_validation();
    var { mask: applyMask, toBuffer } = require_buffer_util();
    var kByteLength = Symbol("kByteLength");
    var maskBuffer = Buffer.alloc(4);
    var RANDOM_POOL_SIZE = 8 * 1024;
    var randomPool;
    var randomPoolPointer = RANDOM_POOL_SIZE;
    var DEFAULT = 0;
    var DEFLATING = 1;
    var GET_BLOB_DATA = 2;
    var Sender2 = class _Sender {
      /**
       * Creates a Sender instance.
       *
       * @param {Duplex} socket The connection socket
       * @param {Object} [extensions] An object containing the negotiated extensions
       * @param {Function} [generateMask] The function used to generate the masking
       *     key
       */
      constructor(socket, extensions, generateMask) {
        this._extensions = extensions || {};
        if (generateMask) {
          this._generateMask = generateMask;
          this._maskBuffer = Buffer.alloc(4);
        }
        this._socket = socket;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._queue = [];
        this._state = DEFAULT;
        this.onerror = NOOP;
        this[kWebSocket] = void 0;
      }
      /**
       * Frames a piece of data according to the HyBi WebSocket protocol.
       *
       * @param {(Buffer|String)} data The data to frame
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @return {(Buffer|String)[]} The framed data
       * @public
       */
      static frame(data, options) {
        let mask;
        let merge = false;
        let offset = 2;
        let skipMasking = false;
        if (options.mask) {
          mask = options.maskBuffer || maskBuffer;
          if (options.generateMask) {
            options.generateMask(mask);
          } else {
            if (randomPoolPointer === RANDOM_POOL_SIZE) {
              if (randomPool === void 0) {
                randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
              }
              randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
              randomPoolPointer = 0;
            }
            mask[0] = randomPool[randomPoolPointer++];
            mask[1] = randomPool[randomPoolPointer++];
            mask[2] = randomPool[randomPoolPointer++];
            mask[3] = randomPool[randomPoolPointer++];
          }
          skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
          offset = 6;
        }
        let dataLength;
        if (typeof data === "string") {
          if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) {
            dataLength = options[kByteLength];
          } else {
            data = Buffer.from(data);
            dataLength = data.length;
          }
        } else {
          dataLength = data.length;
          merge = options.mask && options.readOnly && !skipMasking;
        }
        let payloadLength = dataLength;
        if (dataLength >= 65536) {
          offset += 8;
          payloadLength = 127;
        } else if (dataLength > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
        target[0] = options.fin ? options.opcode | 128 : options.opcode;
        if (options.rsv1)
          target[0] |= 64;
        target[1] = payloadLength;
        if (payloadLength === 126) {
          target.writeUInt16BE(dataLength, 2);
        } else if (payloadLength === 127) {
          target[2] = target[3] = 0;
          target.writeUIntBE(dataLength, 4, 6);
        }
        if (!options.mask)
          return [target, data];
        target[1] |= 128;
        target[offset - 4] = mask[0];
        target[offset - 3] = mask[1];
        target[offset - 2] = mask[2];
        target[offset - 1] = mask[3];
        if (skipMasking)
          return [target, data];
        if (merge) {
          applyMask(data, mask, target, offset, dataLength);
          return [target];
        }
        applyMask(data, mask, data, 0, dataLength);
        return [target, data];
      }
      /**
       * Sends a close message to the other peer.
       *
       * @param {Number} [code] The status code component of the body
       * @param {(String|Buffer)} [data] The message component of the body
       * @param {Boolean} [mask=false] Specifies whether or not to mask the message
       * @param {Function} [cb] Callback
       * @public
       */
      close(code, data, mask, cb) {
        let buf;
        if (code === void 0) {
          buf = EMPTY_BUFFER;
        } else if (typeof code !== "number" || !isValidStatusCode(code)) {
          throw new TypeError("First argument must be a valid error code number");
        } else if (data === void 0 || !data.length) {
          buf = Buffer.allocUnsafe(2);
          buf.writeUInt16BE(code, 0);
        } else {
          const length = Buffer.byteLength(data);
          if (length > 123) {
            throw new RangeError("The message must not be greater than 123 bytes");
          }
          buf = Buffer.allocUnsafe(2 + length);
          buf.writeUInt16BE(code, 0);
          if (typeof data === "string") {
            buf.write(data, 2);
          } else {
            buf.set(data, 2);
          }
        }
        const options = {
          [kByteLength]: buf.length,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 8,
          readOnly: false,
          rsv1: false
        };
        if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, buf, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(buf, options), cb);
        }
      }
      /**
       * Sends a ping message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      ping(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 9,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a pong message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      pong(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 10,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a data message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Object} options Options object
       * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
       *     or text
       * @param {Boolean} [options.compress=false] Specifies whether or not to
       *     compress `data`
       * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Function} [cb] Callback
       * @public
       */
      send(data, options, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        let opcode = options.binary ? 2 : 1;
        let rsv1 = options.compress;
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
            rsv1 = byteLength >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin)
          this._firstFragment = true;
        const opts = {
          [kByteLength]: byteLength,
          fin: options.fin,
          generateMask: this._generateMask,
          mask: options.mask,
          maskBuffer: this._maskBuffer,
          opcode,
          readOnly,
          rsv1
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, this._compress, opts, cb]);
          } else {
            this.getBlobData(data, this._compress, opts, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, this._compress, opts, cb]);
        } else {
          this.dispatch(data, this._compress, opts, cb);
        }
      }
      /**
       * Gets the contents of a blob as binary data.
       *
       * @param {Blob} blob The blob
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     the data
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      getBlobData(blob2, compress, options, cb) {
        this._bufferedBytes += options[kByteLength];
        this._state = GET_BLOB_DATA;
        blob2.arrayBuffer().then((arrayBuffer) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while the blob was being read"
            );
            process.nextTick(callCallbacks, this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          const data = toBuffer(arrayBuffer);
          if (!compress) {
            this._state = DEFAULT;
            this.sendFrame(_Sender.frame(data, options), cb);
            this.dequeue();
          } else {
            this.dispatch(data, compress, options, cb);
          }
        }).catch((err) => {
          process.nextTick(onError, this, err, cb);
        });
      }
      /**
       * Dispatches a message.
       *
       * @param {(Buffer|String)} data The message to send
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     `data`
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      dispatch(data, compress, options, cb) {
        if (!compress) {
          this.sendFrame(_Sender.frame(data, options), cb);
          return;
        }
        const perMessageDeflate = this._extensions[PerMessageDeflate2.extensionName];
        this._bufferedBytes += options[kByteLength];
        this._state = DEFLATING;
        perMessageDeflate.compress(data, options.fin, (_, buf) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while data was being compressed"
            );
            callCallbacks(this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          this._state = DEFAULT;
          options.readOnly = false;
          this.sendFrame(_Sender.frame(buf, options), cb);
          this.dequeue();
        });
      }
      /**
       * Executes queued send operations.
       *
       * @private
       */
      dequeue() {
        while (this._state === DEFAULT && this._queue.length) {
          const params = this._queue.shift();
          this._bufferedBytes -= params[3][kByteLength];
          Reflect.apply(params[0], this, params.slice(1));
        }
      }
      /**
       * Enqueues a send operation.
       *
       * @param {Array} params Send operation parameters.
       * @private
       */
      enqueue(params) {
        this._bufferedBytes += params[3][kByteLength];
        this._queue.push(params);
      }
      /**
       * Sends a frame.
       *
       * @param {(Buffer | String)[]} list The frame to send
       * @param {Function} [cb] Callback
       * @private
       */
      sendFrame(list, cb) {
        if (list.length === 2) {
          this._socket.cork();
          this._socket.write(list[0]);
          this._socket.write(list[1], cb);
          this._socket.uncork();
        } else {
          this._socket.write(list[0], cb);
        }
      }
    };
    module2.exports = Sender2;
    function callCallbacks(sender, err, cb) {
      if (typeof cb === "function")
        cb(err);
      for (let i = 0; i < sender._queue.length; i++) {
        const params = sender._queue[i];
        const callback = params[params.length - 1];
        if (typeof callback === "function")
          callback(err);
      }
    }
    function onError(sender, err, cb) {
      callCallbacks(sender, err, cb);
      sender.onerror(err);
    }
  }
});

// node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({
  "node_modules/ws/lib/event-target.js"(exports2, module2) {
    "use strict";
    var { kForOnEventAttribute, kListener } = require_constants();
    var kCode = Symbol("kCode");
    var kData = Symbol("kData");
    var kError = Symbol("kError");
    var kMessage = Symbol("kMessage");
    var kReason = Symbol("kReason");
    var kTarget = Symbol("kTarget");
    var kType = Symbol("kType");
    var kWasClean = Symbol("kWasClean");
    var Event = class {
      /**
       * Create a new `Event`.
       *
       * @param {String} type The name of the event
       * @throws {TypeError} If the `type` argument is not specified
       */
      constructor(type) {
        this[kTarget] = null;
        this[kType] = type;
      }
      /**
       * @type {*}
       */
      get target() {
        return this[kTarget];
      }
      /**
       * @type {String}
       */
      get type() {
        return this[kType];
      }
    };
    Object.defineProperty(Event.prototype, "target", { enumerable: true });
    Object.defineProperty(Event.prototype, "type", { enumerable: true });
    var CloseEvent = class extends Event {
      /**
       * Create a new `CloseEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {Number} [options.code=0] The status code explaining why the
       *     connection was closed
       * @param {String} [options.reason=''] A human-readable string explaining why
       *     the connection was closed
       * @param {Boolean} [options.wasClean=false] Indicates whether or not the
       *     connection was cleanly closed
       */
      constructor(type, options = {}) {
        super(type);
        this[kCode] = options.code === void 0 ? 0 : options.code;
        this[kReason] = options.reason === void 0 ? "" : options.reason;
        this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
      }
      /**
       * @type {Number}
       */
      get code() {
        return this[kCode];
      }
      /**
       * @type {String}
       */
      get reason() {
        return this[kReason];
      }
      /**
       * @type {Boolean}
       */
      get wasClean() {
        return this[kWasClean];
      }
    };
    Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
    var ErrorEvent = class extends Event {
      /**
       * Create a new `ErrorEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.error=null] The error that generated this event
       * @param {String} [options.message=''] The error message
       */
      constructor(type, options = {}) {
        super(type);
        this[kError] = options.error === void 0 ? null : options.error;
        this[kMessage] = options.message === void 0 ? "" : options.message;
      }
      /**
       * @type {*}
       */
      get error() {
        return this[kError];
      }
      /**
       * @type {String}
       */
      get message() {
        return this[kMessage];
      }
    };
    Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
    Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
    var MessageEvent = class extends Event {
      /**
       * Create a new `MessageEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.data=null] The message content
       */
      constructor(type, options = {}) {
        super(type);
        this[kData] = options.data === void 0 ? null : options.data;
      }
      /**
       * @type {*}
       */
      get data() {
        return this[kData];
      }
    };
    Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
    var EventTarget = {
      /**
       * Register an event listener.
       *
       * @param {String} type A string representing the event type to listen for
       * @param {(Function|Object)} handler The listener to add
       * @param {Object} [options] An options object specifies characteristics about
       *     the event listener
       * @param {Boolean} [options.once=false] A `Boolean` indicating that the
       *     listener should be invoked at most once after being added. If `true`,
       *     the listener would be automatically removed when invoked.
       * @public
       */
      addEventListener(type, handler, options = {}) {
        for (const listener of this.listeners(type)) {
          if (!options[kForOnEventAttribute] && listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            return;
          }
        }
        let wrapper;
        if (type === "message") {
          wrapper = function onMessage(data, isBinary) {
            const event = new MessageEvent("message", {
              data: isBinary ? data : data.toString()
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "close") {
          wrapper = function onClose(code, message) {
            const event = new CloseEvent("close", {
              code,
              reason: message.toString(),
              wasClean: this._closeFrameReceived && this._closeFrameSent
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "error") {
          wrapper = function onError(error) {
            const event = new ErrorEvent("error", {
              error,
              message: error.message
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "open") {
          wrapper = function onOpen() {
            const event = new Event("open");
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else {
          return;
        }
        wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
        wrapper[kListener] = handler;
        if (options.once) {
          this.once(type, wrapper);
        } else {
          this.on(type, wrapper);
        }
      },
      /**
       * Remove an event listener.
       *
       * @param {String} type A string representing the event type to remove
       * @param {(Function|Object)} handler The listener to remove
       * @public
       */
      removeEventListener(type, handler) {
        for (const listener of this.listeners(type)) {
          if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            this.removeListener(type, listener);
            break;
          }
        }
      }
    };
    module2.exports = {
      CloseEvent,
      ErrorEvent,
      Event,
      EventTarget,
      MessageEvent
    };
    function callListener(listener, thisArg, event) {
      if (typeof listener === "object" && listener.handleEvent) {
        listener.handleEvent.call(listener, event);
      } else {
        listener.call(thisArg, event);
      }
    }
  }
});

// node_modules/ws/lib/extension.js
var require_extension = __commonJS({
  "node_modules/ws/lib/extension.js"(exports2, module2) {
    "use strict";
    var { tokenChars } = require_validation();
    function push(dest, name, elem) {
      if (dest[name] === void 0)
        dest[name] = [elem];
      else
        dest[name].push(elem);
    }
    function parse(header) {
      const offers = /* @__PURE__ */ Object.create(null);
      let params = /* @__PURE__ */ Object.create(null);
      let mustUnescape = false;
      let isEscaping = false;
      let inQuotes = false;
      let extensionName;
      let paramName;
      let start = -1;
      let code = -1;
      let end = -1;
      let i = 0;
      for (; i < header.length; i++) {
        code = header.charCodeAt(i);
        if (extensionName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1)
              start = i;
          } else if (i !== 0 && (code === 32 || code === 9)) {
            if (end === -1 && start !== -1)
              end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1)
              end = i;
            const name = header.slice(start, end);
            if (code === 44) {
              push(offers, name, params);
              params = /* @__PURE__ */ Object.create(null);
            } else {
              extensionName = name;
            }
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else if (paramName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1)
              start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1)
              end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1)
              end = i;
            push(params, header.slice(start, end), true);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            start = end = -1;
          } else if (code === 61 && start !== -1 && end === -1) {
            paramName = header.slice(start, i);
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else {
          if (isEscaping) {
            if (tokenChars[code] !== 1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (start === -1)
              start = i;
            else if (!mustUnescape)
              mustUnescape = true;
            isEscaping = false;
          } else if (inQuotes) {
            if (tokenChars[code] === 1) {
              if (start === -1)
                start = i;
            } else if (code === 34 && start !== -1) {
              inQuotes = false;
              end = i;
            } else if (code === 92) {
              isEscaping = true;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
            inQuotes = true;
          } else if (end === -1 && tokenChars[code] === 1) {
            if (start === -1)
              start = i;
          } else if (start !== -1 && (code === 32 || code === 9)) {
            if (end === -1)
              end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1)
              end = i;
            let value = header.slice(start, end);
            if (mustUnescape) {
              value = value.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            paramName = void 0;
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        }
      }
      if (start === -1 || inQuotes || code === 32 || code === 9) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (end === -1)
        end = i;
      const token = header.slice(start, end);
      if (extensionName === void 0) {
        push(offers, token, params);
      } else {
        if (paramName === void 0) {
          push(params, token, true);
        } else if (mustUnescape) {
          push(params, paramName, token.replace(/\\/g, ""));
        } else {
          push(params, paramName, token);
        }
        push(offers, extensionName, params);
      }
      return offers;
    }
    function format(extensions) {
      return Object.keys(extensions).map((extension2) => {
        let configurations = extensions[extension2];
        if (!Array.isArray(configurations))
          configurations = [configurations];
        return configurations.map((params) => {
          return [extension2].concat(
            Object.keys(params).map((k) => {
              let values = params[k];
              if (!Array.isArray(values))
                values = [values];
              return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
            })
          ).join("; ");
        }).join(", ");
      }).join(", ");
    }
    module2.exports = { format, parse };
  }
});

// node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({
  "node_modules/ws/lib/websocket.js"(exports2, module2) {
    "use strict";
    var EventEmitter = require("events");
    var https = require("https");
    var http = require("http");
    var net = require("net");
    var tls = require("tls");
    var { randomBytes, createHash } = require("crypto");
    var { Duplex, Readable } = require("stream");
    var { URL: URL2 } = require("url");
    var PerMessageDeflate2 = require_permessage_deflate();
    var Receiver2 = require_receiver();
    var Sender2 = require_sender();
    var { isBlob } = require_validation();
    var {
      BINARY_TYPES,
      CLOSE_TIMEOUT,
      EMPTY_BUFFER,
      GUID,
      kForOnEventAttribute,
      kListener,
      kStatusCode,
      kWebSocket,
      NOOP
    } = require_constants();
    var {
      EventTarget: { addEventListener, removeEventListener }
    } = require_event_target();
    var { format, parse } = require_extension();
    var { toBuffer } = require_buffer_util();
    var kAborted = Symbol("kAborted");
    var protocolVersions = [8, 13];
    var readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    var subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    var WebSocket2 = class _WebSocket extends EventEmitter {
      /**
       * Create a new `WebSocket`.
       *
       * @param {(String|URL)} address The URL to which to connect
       * @param {(String|String[])} [protocols] The subprotocols
       * @param {Object} [options] Connection options
       */
      constructor(address, protocols, options) {
        super();
        this._binaryType = BINARY_TYPES[0];
        this._closeCode = 1006;
        this._closeFrameReceived = false;
        this._closeFrameSent = false;
        this._closeMessage = EMPTY_BUFFER;
        this._closeTimer = null;
        this._errorEmitted = false;
        this._extensions = {};
        this._paused = false;
        this._protocol = "";
        this._readyState = _WebSocket.CONNECTING;
        this._receiver = null;
        this._sender = null;
        this._socket = null;
        if (address !== null) {
          this._bufferedAmount = 0;
          this._isServer = false;
          this._redirects = 0;
          if (protocols === void 0) {
            protocols = [];
          } else if (!Array.isArray(protocols)) {
            if (typeof protocols === "object" && protocols !== null) {
              options = protocols;
              protocols = [];
            } else {
              protocols = [protocols];
            }
          }
          initAsClient(this, address, protocols, options);
        } else {
          this._autoPong = options.autoPong;
          this._closeTimeout = options.closeTimeout;
          this._isServer = true;
        }
      }
      /**
       * For historical reasons, the custom "nodebuffer" type is used by the default
       * instead of "blob".
       *
       * @type {String}
       */
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(type) {
        if (!BINARY_TYPES.includes(type))
          return;
        this._binaryType = type;
        if (this._receiver)
          this._receiver._binaryType = type;
      }
      /**
       * @type {Number}
       */
      get bufferedAmount() {
        if (!this._socket)
          return this._bufferedAmount;
        return this._socket._writableState.length + this._sender._bufferedBytes;
      }
      /**
       * @type {String}
       */
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      /**
       * @type {Boolean}
       */
      get isPaused() {
        return this._paused;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onclose() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onerror() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onopen() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onmessage() {
        return null;
      }
      /**
       * @type {String}
       */
      get protocol() {
        return this._protocol;
      }
      /**
       * @type {Number}
       */
      get readyState() {
        return this._readyState;
      }
      /**
       * @type {String}
       */
      get url() {
        return this._url;
      }
      /**
       * Set up the socket and the internal resources.
       *
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Object} options Options object
       * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Number} [options.maxPayload=0] The maximum allowed message size
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @private
       */
      setSocket(socket, head, options) {
        const receiver = new Receiver2({
          allowSynchronousEvents: options.allowSynchronousEvents,
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxPayload: options.maxPayload,
          skipUTF8Validation: options.skipUTF8Validation
        });
        const sender = new Sender2(socket, this._extensions, options.generateMask);
        this._receiver = receiver;
        this._sender = sender;
        this._socket = socket;
        receiver[kWebSocket] = this;
        sender[kWebSocket] = this;
        socket[kWebSocket] = this;
        receiver.on("conclude", receiverOnConclude);
        receiver.on("drain", receiverOnDrain);
        receiver.on("error", receiverOnError);
        receiver.on("message", receiverOnMessage);
        receiver.on("ping", receiverOnPing);
        receiver.on("pong", receiverOnPong);
        sender.onerror = senderOnError;
        if (socket.setTimeout)
          socket.setTimeout(0);
        if (socket.setNoDelay)
          socket.setNoDelay();
        if (head.length > 0)
          socket.unshift(head);
        socket.on("close", socketOnClose);
        socket.on("data", socketOnData);
        socket.on("end", socketOnEnd);
        socket.on("error", socketOnError);
        this._readyState = _WebSocket.OPEN;
        this.emit("open");
      }
      /**
       * Emit the `'close'` event.
       *
       * @private
       */
      emitClose() {
        if (!this._socket) {
          this._readyState = _WebSocket.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
          return;
        }
        if (this._extensions[PerMessageDeflate2.extensionName]) {
          this._extensions[PerMessageDeflate2.extensionName].cleanup();
        }
        this._receiver.removeAllListeners();
        this._readyState = _WebSocket.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
      }
      /**
       * Start a closing handshake.
       *
       *          +----------+   +-----------+   +----------+
       *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
       *    |     +----------+   +-----------+   +----------+     |
       *          +----------+   +-----------+         |
       * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
       *          +----------+   +-----------+   |
       *    |           |                        |   +---+        |
       *                +------------------------+-->|fin| - - - -
       *    |         +---+                      |   +---+
       *     - - - - -|fin|<---------------------+
       *              +---+
       *
       * @param {Number} [code] Status code explaining why the connection is closing
       * @param {(String|Buffer)} [data] The reason why the connection is
       *     closing
       * @public
       */
      close(code, data) {
        if (this.readyState === _WebSocket.CLOSED)
          return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this.readyState === _WebSocket.CLOSING) {
          if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
            this._socket.end();
          }
          return;
        }
        this._readyState = _WebSocket.CLOSING;
        this._sender.close(code, data, !this._isServer, (err) => {
          if (err)
            return;
          this._closeFrameSent = true;
          if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
            this._socket.end();
          }
        });
        setCloseTimer(this);
      }
      /**
       * Pause the socket.
       *
       * @public
       */
      pause() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = true;
        this._socket.pause();
      }
      /**
       * Send a ping.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the ping is sent
       * @public
       */
      ping(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0)
          mask = !this._isServer;
        this._sender.ping(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Send a pong.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the pong is sent
       * @public
       */
      pong(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0)
          mask = !this._isServer;
        this._sender.pong(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Resume the socket.
       *
       * @public
       */
      resume() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = false;
        if (!this._receiver._writableState.needDrain)
          this._socket.resume();
      }
      /**
       * Send a data message.
       *
       * @param {*} data The message to send
       * @param {Object} [options] Options object
       * @param {Boolean} [options.binary] Specifies whether `data` is binary or
       *     text
       * @param {Boolean} [options.compress] Specifies whether or not to compress
       *     `data`
       * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when data is written out
       * @public
       */
      send(data, options, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        const opts = {
          binary: typeof data !== "string",
          mask: !this._isServer,
          compress: true,
          fin: true,
          ...options
        };
        if (!this._extensions[PerMessageDeflate2.extensionName]) {
          opts.compress = false;
        }
        this._sender.send(data || EMPTY_BUFFER, opts, cb);
      }
      /**
       * Forcibly close the connection.
       *
       * @public
       */
      terminate() {
        if (this.readyState === _WebSocket.CLOSED)
          return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this._socket) {
          this._readyState = _WebSocket.CLOSING;
          this._socket.destroy();
        }
      }
    };
    Object.defineProperty(WebSocket2, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2.prototype, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket2, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2.prototype, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket2, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket2, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    Object.defineProperty(WebSocket2.prototype, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    [
      "binaryType",
      "bufferedAmount",
      "extensions",
      "isPaused",
      "protocol",
      "readyState",
      "url"
    ].forEach((property) => {
      Object.defineProperty(WebSocket2.prototype, property, { enumerable: true });
    });
    ["open", "error", "close", "message"].forEach((method) => {
      Object.defineProperty(WebSocket2.prototype, `on${method}`, {
        enumerable: true,
        get() {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute])
              return listener[kListener];
          }
          return null;
        },
        set(handler) {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) {
              this.removeListener(method, listener);
              break;
            }
          }
          if (typeof handler !== "function")
            return;
          this.addEventListener(method, handler, {
            [kForOnEventAttribute]: true
          });
        }
      });
    });
    WebSocket2.prototype.addEventListener = addEventListener;
    WebSocket2.prototype.removeEventListener = removeEventListener;
    module2.exports = WebSocket2;
    function initAsClient(websocket, address, protocols, options) {
      const opts = {
        allowSynchronousEvents: true,
        autoPong: true,
        closeTimeout: CLOSE_TIMEOUT,
        protocolVersion: protocolVersions[1],
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: false,
        perMessageDeflate: true,
        followRedirects: false,
        maxRedirects: 10,
        ...options,
        socketPath: void 0,
        hostname: void 0,
        protocol: void 0,
        timeout: void 0,
        method: "GET",
        host: void 0,
        path: void 0,
        port: void 0
      };
      websocket._autoPong = opts.autoPong;
      websocket._closeTimeout = opts.closeTimeout;
      if (!protocolVersions.includes(opts.protocolVersion)) {
        throw new RangeError(
          `Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`
        );
      }
      let parsedUrl;
      if (address instanceof URL2) {
        parsedUrl = address;
      } else {
        try {
          parsedUrl = new URL2(address);
        } catch {
          throw new SyntaxError(`Invalid URL: ${address}`);
        }
      }
      if (parsedUrl.protocol === "http:") {
        parsedUrl.protocol = "ws:";
      } else if (parsedUrl.protocol === "https:") {
        parsedUrl.protocol = "wss:";
      }
      websocket._url = parsedUrl.href;
      const isSecure = parsedUrl.protocol === "wss:";
      const isIpcUrl = parsedUrl.protocol === "ws+unix:";
      let invalidUrlMessage;
      if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) {
        invalidUrlMessage = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
      } else if (isIpcUrl && !parsedUrl.pathname) {
        invalidUrlMessage = "The URL's pathname is empty";
      } else if (parsedUrl.hash) {
        invalidUrlMessage = "The URL contains a fragment identifier";
      }
      if (invalidUrlMessage) {
        const err = new SyntaxError(invalidUrlMessage);
        if (websocket._redirects === 0) {
          throw err;
        } else {
          emitErrorAndClose(websocket, err);
          return;
        }
      }
      const defaultPort = isSecure ? 443 : 80;
      const key = randomBytes(16).toString("base64");
      const request = isSecure ? https.request : http.request;
      const protocolSet = /* @__PURE__ */ new Set();
      let perMessageDeflate;
      opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
      opts.defaultPort = opts.defaultPort || defaultPort;
      opts.port = parsedUrl.port || defaultPort;
      opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
      opts.headers = {
        ...opts.headers,
        "Sec-WebSocket-Version": opts.protocolVersion,
        "Sec-WebSocket-Key": key,
        Connection: "Upgrade",
        Upgrade: "websocket"
      };
      opts.path = parsedUrl.pathname + parsedUrl.search;
      opts.timeout = opts.handshakeTimeout;
      if (opts.perMessageDeflate) {
        perMessageDeflate = new PerMessageDeflate2({
          ...opts.perMessageDeflate,
          isServer: false,
          maxPayload: opts.maxPayload
        });
        opts.headers["Sec-WebSocket-Extensions"] = format({
          [PerMessageDeflate2.extensionName]: perMessageDeflate.offer()
        });
      }
      if (protocols.length) {
        for (const protocol of protocols) {
          if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
            throw new SyntaxError(
              "An invalid or duplicated subprotocol was specified"
            );
          }
          protocolSet.add(protocol);
        }
        opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
      }
      if (opts.origin) {
        if (opts.protocolVersion < 13) {
          opts.headers["Sec-WebSocket-Origin"] = opts.origin;
        } else {
          opts.headers.Origin = opts.origin;
        }
      }
      if (parsedUrl.username || parsedUrl.password) {
        opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
      }
      if (isIpcUrl) {
        const parts = opts.path.split(":");
        opts.socketPath = parts[0];
        opts.path = parts[1];
      }
      let req;
      if (opts.followRedirects) {
        if (websocket._redirects === 0) {
          websocket._originalIpc = isIpcUrl;
          websocket._originalSecure = isSecure;
          websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
          const headers = options && options.headers;
          options = { ...options, headers: {} };
          if (headers) {
            for (const [key2, value] of Object.entries(headers)) {
              options.headers[key2.toLowerCase()] = value;
            }
          }
        } else if (websocket.listenerCount("redirect") === 0) {
          const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
          if (!isSameHost || websocket._originalSecure && !isSecure) {
            delete opts.headers.authorization;
            delete opts.headers.cookie;
            if (!isSameHost)
              delete opts.headers.host;
            opts.auth = void 0;
          }
        }
        if (opts.auth && !options.headers.authorization) {
          options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
        }
        req = websocket._req = request(opts);
        if (websocket._redirects) {
          websocket.emit("redirect", websocket.url, req);
        }
      } else {
        req = websocket._req = request(opts);
      }
      if (opts.timeout) {
        req.on("timeout", () => {
          abortHandshake(websocket, req, "Opening handshake has timed out");
        });
      }
      req.on("error", (err) => {
        if (req === null || req[kAborted])
          return;
        req = websocket._req = null;
        emitErrorAndClose(websocket, err);
      });
      req.on("response", (res) => {
        const location = res.headers.location;
        const statusCode = res.statusCode;
        if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
          if (++websocket._redirects > opts.maxRedirects) {
            abortHandshake(websocket, req, "Maximum redirects exceeded");
            return;
          }
          req.abort();
          let addr;
          try {
            addr = new URL2(location, address);
          } catch (e) {
            const err = new SyntaxError(`Invalid URL: ${location}`);
            emitErrorAndClose(websocket, err);
            return;
          }
          initAsClient(websocket, addr, protocols, options);
        } else if (!websocket.emit("unexpected-response", req, res)) {
          abortHandshake(
            websocket,
            req,
            `Unexpected server response: ${res.statusCode}`
          );
        }
      });
      req.on("upgrade", (res, socket, head) => {
        websocket.emit("upgrade", res);
        if (websocket.readyState !== WebSocket2.CONNECTING)
          return;
        req = websocket._req = null;
        const upgrade = res.headers.upgrade;
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          abortHandshake(websocket, socket, "Invalid Upgrade header");
          return;
        }
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        if (res.headers["sec-websocket-accept"] !== digest) {
          abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
          return;
        }
        const serverProt = res.headers["sec-websocket-protocol"];
        let protError;
        if (serverProt !== void 0) {
          if (!protocolSet.size) {
            protError = "Server sent a subprotocol but none was requested";
          } else if (!protocolSet.has(serverProt)) {
            protError = "Server sent an invalid subprotocol";
          }
        } else if (protocolSet.size) {
          protError = "Server sent no subprotocol";
        }
        if (protError) {
          abortHandshake(websocket, socket, protError);
          return;
        }
        if (serverProt)
          websocket._protocol = serverProt;
        const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
        if (secWebSocketExtensions !== void 0) {
          if (!perMessageDeflate) {
            const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          let extensions;
          try {
            extensions = parse(secWebSocketExtensions);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          const extensionNames = Object.keys(extensions);
          if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate2.extensionName) {
            const message = "Server indicated an extension that was not requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          try {
            perMessageDeflate.accept(extensions[PerMessageDeflate2.extensionName]);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          websocket._extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
        }
        websocket.setSocket(socket, head, {
          allowSynchronousEvents: opts.allowSynchronousEvents,
          generateMask: opts.generateMask,
          maxPayload: opts.maxPayload,
          skipUTF8Validation: opts.skipUTF8Validation
        });
      });
      if (opts.finishRequest) {
        opts.finishRequest(req, websocket);
      } else {
        req.end();
      }
    }
    function emitErrorAndClose(websocket, err) {
      websocket._readyState = WebSocket2.CLOSING;
      websocket._errorEmitted = true;
      websocket.emit("error", err);
      websocket.emitClose();
    }
    function netConnect(options) {
      options.path = options.socketPath;
      return net.connect(options);
    }
    function tlsConnect(options) {
      options.path = void 0;
      if (!options.servername && options.servername !== "") {
        options.servername = net.isIP(options.host) ? "" : options.host;
      }
      return tls.connect(options);
    }
    function abortHandshake(websocket, stream, message) {
      websocket._readyState = WebSocket2.CLOSING;
      const err = new Error(message);
      Error.captureStackTrace(err, abortHandshake);
      if (stream.setHeader) {
        stream[kAborted] = true;
        stream.abort();
        if (stream.socket && !stream.socket.destroyed) {
          stream.socket.destroy();
        }
        process.nextTick(emitErrorAndClose, websocket, err);
      } else {
        stream.destroy(err);
        stream.once("error", websocket.emit.bind(websocket, "error"));
        stream.once("close", websocket.emitClose.bind(websocket));
      }
    }
    function sendAfterClose(websocket, data, cb) {
      if (data) {
        const length = isBlob(data) ? data.size : toBuffer(data).length;
        if (websocket._socket)
          websocket._sender._bufferedBytes += length;
        else
          websocket._bufferedAmount += length;
      }
      if (cb) {
        const err = new Error(
          `WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`
        );
        process.nextTick(cb, err);
      }
    }
    function receiverOnConclude(code, reason) {
      const websocket = this[kWebSocket];
      websocket._closeFrameReceived = true;
      websocket._closeMessage = reason;
      websocket._closeCode = code;
      if (websocket._socket[kWebSocket] === void 0)
        return;
      websocket._socket.removeListener("data", socketOnData);
      process.nextTick(resume, websocket._socket);
      if (code === 1005)
        websocket.close();
      else
        websocket.close(code, reason);
    }
    function receiverOnDrain() {
      const websocket = this[kWebSocket];
      if (!websocket.isPaused)
        websocket._socket.resume();
    }
    function receiverOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket._socket[kWebSocket] !== void 0) {
        websocket._socket.removeListener("data", socketOnData);
        process.nextTick(resume, websocket._socket);
        websocket.close(err[kStatusCode]);
      }
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function receiverOnFinish() {
      this[kWebSocket].emitClose();
    }
    function receiverOnMessage(data, isBinary) {
      this[kWebSocket].emit("message", data, isBinary);
    }
    function receiverOnPing(data) {
      const websocket = this[kWebSocket];
      if (websocket._autoPong)
        websocket.pong(data, !this._isServer, NOOP);
      websocket.emit("ping", data);
    }
    function receiverOnPong(data) {
      this[kWebSocket].emit("pong", data);
    }
    function resume(stream) {
      stream.resume();
    }
    function senderOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket.readyState === WebSocket2.CLOSED)
        return;
      if (websocket.readyState === WebSocket2.OPEN) {
        websocket._readyState = WebSocket2.CLOSING;
        setCloseTimer(websocket);
      }
      this._socket.end();
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function setCloseTimer(websocket) {
      websocket._closeTimer = setTimeout(
        websocket._socket.destroy.bind(websocket._socket),
        websocket._closeTimeout
      );
    }
    function socketOnClose() {
      const websocket = this[kWebSocket];
      this.removeListener("close", socketOnClose);
      this.removeListener("data", socketOnData);
      this.removeListener("end", socketOnEnd);
      websocket._readyState = WebSocket2.CLOSING;
      if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
        const chunk = this.read(this._readableState.length);
        websocket._receiver.write(chunk);
      }
      websocket._receiver.end();
      this[kWebSocket] = void 0;
      clearTimeout(websocket._closeTimer);
      if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) {
        websocket.emitClose();
      } else {
        websocket._receiver.on("error", receiverOnFinish);
        websocket._receiver.on("finish", receiverOnFinish);
      }
    }
    function socketOnData(chunk) {
      if (!this[kWebSocket]._receiver.write(chunk)) {
        this.pause();
      }
    }
    function socketOnEnd() {
      const websocket = this[kWebSocket];
      websocket._readyState = WebSocket2.CLOSING;
      websocket._receiver.end();
      this.end();
    }
    function socketOnError() {
      const websocket = this[kWebSocket];
      this.removeListener("error", socketOnError);
      this.on("error", NOOP);
      if (websocket) {
        websocket._readyState = WebSocket2.CLOSING;
        this.destroy();
      }
    }
  }
});

// node_modules/ws/lib/stream.js
var require_stream = __commonJS({
  "node_modules/ws/lib/stream.js"(exports2, module2) {
    "use strict";
    var WebSocket2 = require_websocket();
    var { Duplex } = require("stream");
    function emitClose(stream) {
      stream.emit("close");
    }
    function duplexOnEnd() {
      if (!this.destroyed && this._writableState.finished) {
        this.destroy();
      }
    }
    function duplexOnError(err) {
      this.removeListener("error", duplexOnError);
      this.destroy();
      if (this.listenerCount("error") === 0) {
        this.emit("error", err);
      }
    }
    function createWebSocketStream2(ws, options) {
      let terminateOnDestroy = true;
      const duplex = new Duplex({
        ...options,
        autoDestroy: false,
        emitClose: false,
        objectMode: false,
        writableObjectMode: false
      });
      ws.on("message", function message(msg, isBinary) {
        const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
        if (!duplex.push(data))
          ws.pause();
      });
      ws.once("error", function error(err) {
        if (duplex.destroyed)
          return;
        terminateOnDestroy = false;
        duplex.destroy(err);
      });
      ws.once("close", function close() {
        if (duplex.destroyed)
          return;
        duplex.push(null);
      });
      duplex._destroy = function(err, callback) {
        if (ws.readyState === ws.CLOSED) {
          callback(err);
          process.nextTick(emitClose, duplex);
          return;
        }
        let called = false;
        ws.once("error", function error(err2) {
          called = true;
          callback(err2);
        });
        ws.once("close", function close() {
          if (!called)
            callback(err);
          process.nextTick(emitClose, duplex);
        });
        if (terminateOnDestroy)
          ws.terminate();
      };
      duplex._final = function(callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._final(callback);
          });
          return;
        }
        if (ws._socket === null)
          return;
        if (ws._socket._writableState.finished) {
          callback();
          if (duplex._readableState.endEmitted)
            duplex.destroy();
        } else {
          ws._socket.once("finish", function finish() {
            callback();
          });
          ws.close();
        }
      };
      duplex._read = function() {
        if (ws.isPaused)
          ws.resume();
      };
      duplex._write = function(chunk, encoding, callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._write(chunk, encoding, callback);
          });
          return;
        }
        ws.send(chunk, callback);
      };
      duplex.on("end", duplexOnEnd);
      duplex.on("error", duplexOnError);
      return duplex;
    }
    module2.exports = createWebSocketStream2;
  }
});

// node_modules/ws/lib/subprotocol.js
var require_subprotocol = __commonJS({
  "node_modules/ws/lib/subprotocol.js"(exports2, module2) {
    "use strict";
    var { tokenChars } = require_validation();
    function parse(header) {
      const protocols = /* @__PURE__ */ new Set();
      let start = -1;
      let end = -1;
      let i = 0;
      for (i; i < header.length; i++) {
        const code = header.charCodeAt(i);
        if (end === -1 && tokenChars[code] === 1) {
          if (start === -1)
            start = i;
        } else if (i !== 0 && (code === 32 || code === 9)) {
          if (end === -1 && start !== -1)
            end = i;
        } else if (code === 44) {
          if (start === -1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (end === -1)
            end = i;
          const protocol2 = header.slice(start, end);
          if (protocols.has(protocol2)) {
            throw new SyntaxError(`The "${protocol2}" subprotocol is duplicated`);
          }
          protocols.add(protocol2);
          start = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      }
      if (start === -1 || end !== -1) {
        throw new SyntaxError("Unexpected end of input");
      }
      const protocol = header.slice(start, i);
      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }
      protocols.add(protocol);
      return protocols;
    }
    module2.exports = { parse };
  }
});

// node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "node_modules/ws/lib/websocket-server.js"(exports2, module2) {
    "use strict";
    var EventEmitter = require("events");
    var http = require("http");
    var { Duplex } = require("stream");
    var { createHash } = require("crypto");
    var extension2 = require_extension();
    var PerMessageDeflate2 = require_permessage_deflate();
    var subprotocol2 = require_subprotocol();
    var WebSocket2 = require_websocket();
    var { CLOSE_TIMEOUT, GUID, kWebSocket } = require_constants();
    var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
    var RUNNING = 0;
    var CLOSING = 1;
    var CLOSED = 2;
    var WebSocketServer2 = class extends EventEmitter {
      /**
       * Create a `WebSocketServer` instance.
       *
       * @param {Object} options Configuration options
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Boolean} [options.autoPong=true] Specifies whether or not to
       *     automatically send a pong in response to a ping
       * @param {Number} [options.backlog=511] The maximum length of the queue of
       *     pending connections
       * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
       *     track clients
       * @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
       *     wait for the closing handshake to finish after `websocket.close()` is
       *     called
       * @param {Function} [options.handleProtocols] A hook to handle protocols
       * @param {String} [options.host] The hostname where to bind the server
       * @param {Number} [options.maxPayload=104857600] The maximum allowed message
       *     size
       * @param {Boolean} [options.noServer=false] Enable no server mode
       * @param {String} [options.path] Accept only connections matching this path
       * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
       *     permessage-deflate
       * @param {Number} [options.port] The port where to bind the server
       * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
       *     server to use
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @param {Function} [options.verifyClient] A hook to reject connections
       * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
       *     class to use. It must be the `WebSocket` class or class that extends it
       * @param {Function} [callback] A listener for the `listening` event
       */
      constructor(options, callback) {
        super();
        options = {
          allowSynchronousEvents: true,
          autoPong: true,
          maxPayload: 100 * 1024 * 1024,
          skipUTF8Validation: false,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          closeTimeout: CLOSE_TIMEOUT,
          verifyClient: null,
          noServer: false,
          backlog: null,
          // use default (511 as implemented in net.js)
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket: WebSocket2,
          ...options
        };
        if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
          throw new TypeError(
            'One and only one of the "port", "server", or "noServer" options must be specified'
          );
        }
        if (options.port != null) {
          this._server = http.createServer((req, res) => {
            const body = http.STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          this._server.listen(
            options.port,
            options.host,
            options.backlog,
            callback
          );
        } else if (options.server) {
          this._server = options.server;
        }
        if (this._server) {
          const emitConnection = this.emit.bind(this, "connection");
          this._removeListeners = addListeners(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: (req, socket, head) => {
              this.handleUpgrade(req, socket, head, emitConnection);
            }
          });
        }
        if (options.perMessageDeflate === true)
          options.perMessageDeflate = {};
        if (options.clientTracking) {
          this.clients = /* @__PURE__ */ new Set();
          this._shouldEmitClose = false;
        }
        this.options = options;
        this._state = RUNNING;
      }
      /**
       * Returns the bound address, the address family name, and port of the server
       * as reported by the operating system if listening on an IP socket.
       * If the server is listening on a pipe or UNIX domain socket, the name is
       * returned as a string.
       *
       * @return {(Object|String|null)} The address of the server
       * @public
       */
      address() {
        if (this.options.noServer) {
          throw new Error('The server is operating in "noServer" mode');
        }
        if (!this._server)
          return null;
        return this._server.address();
      }
      /**
       * Stop the server from accepting new connections and emit the `'close'` event
       * when all existing connections are closed.
       *
       * @param {Function} [cb] A one-time listener for the `'close'` event
       * @public
       */
      close(cb) {
        if (this._state === CLOSED) {
          if (cb) {
            this.once("close", () => {
              cb(new Error("The server is not running"));
            });
          }
          process.nextTick(emitClose, this);
          return;
        }
        if (cb)
          this.once("close", cb);
        if (this._state === CLOSING)
          return;
        this._state = CLOSING;
        if (this.options.noServer || this.options.server) {
          if (this._server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
          }
          if (this.clients) {
            if (!this.clients.size) {
              process.nextTick(emitClose, this);
            } else {
              this._shouldEmitClose = true;
            }
          } else {
            process.nextTick(emitClose, this);
          }
        } else {
          const server = this._server;
          this._removeListeners();
          this._removeListeners = this._server = null;
          server.close(() => {
            emitClose(this);
          });
        }
      }
      /**
       * See if a given request should be handled by this server instance.
       *
       * @param {http.IncomingMessage} req Request object to inspect
       * @return {Boolean} `true` if the request is valid, else `false`
       * @public
       */
      shouldHandle(req) {
        if (this.options.path) {
          const index = req.url.indexOf("?");
          const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
          if (pathname !== this.options.path)
            return false;
        }
        return true;
      }
      /**
       * Handle a HTTP Upgrade request.
       *
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @public
       */
      handleUpgrade(req, socket, head, cb) {
        socket.on("error", socketOnError);
        const key = req.headers["sec-websocket-key"];
        const upgrade = req.headers.upgrade;
        const version3 = +req.headers["sec-websocket-version"];
        if (req.method !== "GET") {
          const message = "Invalid HTTP method";
          abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
          return;
        }
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          const message = "Invalid Upgrade header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (key === void 0 || !keyRegex.test(key)) {
          const message = "Missing or invalid Sec-WebSocket-Key header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (version3 !== 13 && version3 !== 8) {
          const message = "Missing or invalid Sec-WebSocket-Version header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message, {
            "Sec-WebSocket-Version": "13, 8"
          });
          return;
        }
        if (!this.shouldHandle(req)) {
          abortHandshake(socket, 400);
          return;
        }
        const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
        let protocols = /* @__PURE__ */ new Set();
        if (secWebSocketProtocol !== void 0) {
          try {
            protocols = subprotocol2.parse(secWebSocketProtocol);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Protocol header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
        const extensions = {};
        if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
          const perMessageDeflate = new PerMessageDeflate2({
            ...this.options.perMessageDeflate,
            isServer: true,
            maxPayload: this.options.maxPayload
          });
          try {
            const offers = extension2.parse(secWebSocketExtensions);
            if (offers[PerMessageDeflate2.extensionName]) {
              perMessageDeflate.accept(offers[PerMessageDeflate2.extensionName]);
              extensions[PerMessageDeflate2.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            const message = "Invalid or unacceptable Sec-WebSocket-Extensions header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        if (this.options.verifyClient) {
          const info = {
            origin: req.headers[`${version3 === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(req.socket.authorized || req.socket.encrypted),
            req
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(info, (verified, code, message, headers) => {
              if (!verified) {
                return abortHandshake(socket, code || 401, message, headers);
              }
              this.completeUpgrade(
                extensions,
                key,
                protocols,
                req,
                socket,
                head,
                cb
              );
            });
            return;
          }
          if (!this.options.verifyClient(info))
            return abortHandshake(socket, 401);
        }
        this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
      }
      /**
       * Upgrade the connection to WebSocket.
       *
       * @param {Object} extensions The accepted extensions
       * @param {String} key The value of the `Sec-WebSocket-Key` header
       * @param {Set} protocols The subprotocols
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @throws {Error} If called more than once with the same socket
       * @private
       */
      completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
        if (!socket.readable || !socket.writable)
          return socket.destroy();
        if (socket[kWebSocket]) {
          throw new Error(
            "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
          );
        }
        if (this._state > RUNNING)
          return abortHandshake(socket, 503);
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        const headers = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Accept: ${digest}`
        ];
        const ws = new this.options.WebSocket(null, void 0, this.options);
        if (protocols.size) {
          const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws._protocol = protocol;
          }
        }
        if (extensions[PerMessageDeflate2.extensionName]) {
          const params = extensions[PerMessageDeflate2.extensionName].params;
          const value = extension2.format({
            [PerMessageDeflate2.extensionName]: [params]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value}`);
          ws._extensions = extensions;
        }
        this.emit("headers", headers, req);
        socket.write(headers.concat("\r\n").join("\r\n"));
        socket.removeListener("error", socketOnError);
        ws.setSocket(socket, head, {
          allowSynchronousEvents: this.options.allowSynchronousEvents,
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        });
        if (this.clients) {
          this.clients.add(ws);
          ws.on("close", () => {
            this.clients.delete(ws);
            if (this._shouldEmitClose && !this.clients.size) {
              process.nextTick(emitClose, this);
            }
          });
        }
        cb(ws, req);
      }
    };
    module2.exports = WebSocketServer2;
    function addListeners(server, map) {
      for (const event of Object.keys(map))
        server.on(event, map[event]);
      return function removeListeners() {
        for (const event of Object.keys(map)) {
          server.removeListener(event, map[event]);
        }
      };
    }
    function emitClose(server) {
      server._state = CLOSED;
      server.emit("close");
    }
    function socketOnError() {
      this.destroy();
    }
    function abortHandshake(socket, code, message, headers) {
      message = message || http.STATUS_CODES[code];
      headers = {
        Connection: "close",
        "Content-Type": "text/html",
        "Content-Length": Buffer.byteLength(message),
        ...headers
      };
      socket.once("finish", socket.destroy);
      socket.end(
        `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message
      );
    }
    function abortHandshakeOrEmitwsClientError(server, req, socket, code, message, headers) {
      if (server.listenerCount("wsClientError")) {
        const err = new Error(message);
        Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
        server.emit("wsClientError", err, socket, req);
      } else {
        abortHandshake(socket, code, message, headers);
      }
    }
  }
});

// node_modules/ws/wrapper.mjs
var import_stream, import_extension, import_permessage_deflate, import_receiver, import_sender, import_subprotocol, import_websocket, import_websocket_server;
var init_wrapper = __esm({
  "node_modules/ws/wrapper.mjs"() {
    import_stream = __toESM(require_stream(), 1);
    import_extension = __toESM(require_extension(), 1);
    import_permessage_deflate = __toESM(require_permessage_deflate(), 1);
    import_receiver = __toESM(require_receiver(), 1);
    import_sender = __toESM(require_sender(), 1);
    import_subprotocol = __toESM(require_subprotocol(), 1);
    import_websocket = __toESM(require_websocket(), 1);
    import_websocket_server = __toESM(require_websocket_server(), 1);
  }
});

// node_modules/@libsql/isomorphic-ws/node.mjs
var init_node = __esm({
  "node_modules/@libsql/isomorphic-ws/node.mjs"() {
    init_wrapper();
  }
});

// node_modules/@libsql/hrana-client/lib-esm/client.js
var Client;
var init_client = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/client.js"() {
    Client = class {
      /** @private */
      constructor() {
        this.intMode = "number";
      }
      /** Representation of integers returned from the database. See {@link IntMode}.
       *
       * This value is inherited by {@link Stream} objects created with {@link openStream}, but you can
       * override the integer mode for every stream by setting {@link Stream.intMode} on the stream.
       */
      intMode;
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/errors.js
var ClientError, ProtoError, ResponseError, ClosedError, WebSocketUnsupportedError, WebSocketError, HttpServerError, ProtocolVersionError, InternalError, MisuseError;
var init_errors2 = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/errors.js"() {
    ClientError = class extends Error {
      /** @private */
      constructor(message) {
        super(message);
        this.name = "ClientError";
      }
    };
    ProtoError = class extends ClientError {
      /** @private */
      constructor(message) {
        super(message);
        this.name = "ProtoError";
      }
    };
    ResponseError = class extends ClientError {
      code;
      /** @internal */
      proto;
      /** @private */
      constructor(message, protoError) {
        super(message);
        this.name = "ResponseError";
        this.code = protoError.code;
        this.proto = protoError;
        this.stack = void 0;
      }
    };
    ClosedError = class extends ClientError {
      /** @private */
      constructor(message, cause) {
        if (cause !== void 0) {
          super(`${message}: ${cause}`);
          this.cause = cause;
        } else {
          super(message);
        }
        this.name = "ClosedError";
      }
    };
    WebSocketUnsupportedError = class extends ClientError {
      /** @private */
      constructor(message) {
        super(message);
        this.name = "WebSocketUnsupportedError";
      }
    };
    WebSocketError = class extends ClientError {
      /** @private */
      constructor(message) {
        super(message);
        this.name = "WebSocketError";
      }
    };
    HttpServerError = class extends ClientError {
      status;
      /** @private */
      constructor(message, status) {
        super(message);
        this.status = status;
        this.name = "HttpServerError";
      }
    };
    ProtocolVersionError = class extends ClientError {
      /** @private */
      constructor(message) {
        super(message);
        this.name = "ProtocolVersionError";
      }
    };
    InternalError = class extends ClientError {
      /** @private */
      constructor(message) {
        super(message);
        this.name = "InternalError";
      }
    };
    MisuseError = class extends ClientError {
      /** @private */
      constructor(message) {
        super(message);
        this.name = "MisuseError";
      }
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/encoding/json/decode.js
function string(value) {
  if (typeof value === "string") {
    return value;
  }
  throw typeError(value, "string");
}
function stringOpt(value) {
  if (value === null || value === void 0) {
    return void 0;
  } else if (typeof value === "string") {
    return value;
  }
  throw typeError(value, "string or null");
}
function number(value) {
  if (typeof value === "number") {
    return value;
  }
  throw typeError(value, "number");
}
function boolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  throw typeError(value, "boolean");
}
function array(value) {
  if (Array.isArray(value)) {
    return value;
  }
  throw typeError(value, "array");
}
function object(value) {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }
  throw typeError(value, "object");
}
function arrayObjectsMap(value, fun) {
  return array(value).map((elemValue) => fun(object(elemValue)));
}
function typeError(value, expected) {
  if (value === void 0) {
    return new ProtoError(`Expected ${expected}, but the property was missing`);
  }
  let received = typeof value;
  if (value === null) {
    received = "null";
  } else if (Array.isArray(value)) {
    received = "array";
  }
  return new ProtoError(`Expected ${expected}, received ${received}`);
}
function readJsonObject(value, fun) {
  return fun(object(value));
}
var init_decode = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/encoding/json/decode.js"() {
    init_errors2();
  }
});

// node_modules/@libsql/hrana-client/lib-esm/encoding/json/encode.js
function writeJsonObject(value, fun) {
  const output = [];
  const writer = new ObjectWriter(output);
  writer.begin();
  fun(writer, value);
  writer.end();
  return output.join("");
}
var ObjectWriter;
var init_encode = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/encoding/json/encode.js"() {
    ObjectWriter = class {
      #output;
      #isFirst;
      constructor(output) {
        this.#output = output;
        this.#isFirst = false;
      }
      begin() {
        this.#output.push("{");
        this.#isFirst = true;
      }
      end() {
        this.#output.push("}");
        this.#isFirst = false;
      }
      #key(name) {
        if (this.#isFirst) {
          this.#output.push('"');
          this.#isFirst = false;
        } else {
          this.#output.push(',"');
        }
        this.#output.push(name);
        this.#output.push('":');
      }
      string(name, value) {
        this.#key(name);
        this.#output.push(JSON.stringify(value));
      }
      stringRaw(name, value) {
        this.#key(name);
        this.#output.push('"');
        this.#output.push(value);
        this.#output.push('"');
      }
      number(name, value) {
        this.#key(name);
        this.#output.push("" + value);
      }
      boolean(name, value) {
        this.#key(name);
        this.#output.push(value ? "true" : "false");
      }
      object(name, value, valueFun) {
        this.#key(name);
        this.begin();
        valueFun(this, value);
        this.end();
      }
      arrayObjects(name, values, valueFun) {
        this.#key(name);
        this.#output.push("[");
        for (let i = 0; i < values.length; ++i) {
          if (i !== 0) {
            this.#output.push(",");
          }
          this.begin();
          valueFun(this, values[i]);
          this.end();
        }
        this.#output.push("]");
      }
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/util.js
var VARINT, FIXED_64, LENGTH_DELIMITED, FIXED_32;
var init_util2 = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/util.js"() {
    VARINT = 0;
    FIXED_64 = 1;
    LENGTH_DELIMITED = 2;
    FIXED_32 = 5;
  }
});

// node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/decode.js
function readProtobufMessage(data, def) {
  const msgReader = new MessageReader(data);
  const fieldReader = new FieldReader(msgReader);
  let value = def.default();
  while (!msgReader.eof()) {
    const key = msgReader.varint();
    const tag = key >> 3;
    const wireType = key & 7;
    fieldReader.setup(wireType);
    const tagFun = def[tag];
    if (tagFun !== void 0) {
      const returnedValue = tagFun(fieldReader, value);
      if (returnedValue !== void 0) {
        value = returnedValue;
      }
    }
    fieldReader.maybeSkip();
  }
  return value;
}
var MessageReader, FieldReader;
var init_decode2 = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/decode.js"() {
    init_errors2();
    init_util2();
    MessageReader = class {
      #array;
      #view;
      #pos;
      constructor(array2) {
        this.#array = array2;
        this.#view = new DataView(array2.buffer, array2.byteOffset, array2.byteLength);
        this.#pos = 0;
      }
      varint() {
        let value = 0;
        for (let shift = 0; ; shift += 7) {
          const byte = this.#array[this.#pos++];
          value |= (byte & 127) << shift;
          if (!(byte & 128)) {
            break;
          }
        }
        return value;
      }
      varintBig() {
        let value = 0n;
        for (let shift = 0n; ; shift += 7n) {
          const byte = this.#array[this.#pos++];
          value |= BigInt(byte & 127) << shift;
          if (!(byte & 128)) {
            break;
          }
        }
        return value;
      }
      bytes(length) {
        const array2 = new Uint8Array(this.#array.buffer, this.#array.byteOffset + this.#pos, length);
        this.#pos += length;
        return array2;
      }
      double() {
        const value = this.#view.getFloat64(this.#pos, true);
        this.#pos += 8;
        return value;
      }
      skipVarint() {
        for (; ; ) {
          const byte = this.#array[this.#pos++];
          if (!(byte & 128)) {
            break;
          }
        }
      }
      skip(count) {
        this.#pos += count;
      }
      eof() {
        return this.#pos >= this.#array.byteLength;
      }
    };
    FieldReader = class {
      #reader;
      #wireType;
      constructor(reader) {
        this.#reader = reader;
        this.#wireType = -1;
      }
      setup(wireType) {
        this.#wireType = wireType;
      }
      #expect(expectedWireType) {
        if (this.#wireType !== expectedWireType) {
          throw new ProtoError(`Expected wire type ${expectedWireType}, got ${this.#wireType}`);
        }
        this.#wireType = -1;
      }
      bytes() {
        this.#expect(LENGTH_DELIMITED);
        const length = this.#reader.varint();
        return this.#reader.bytes(length);
      }
      string() {
        return new TextDecoder().decode(this.bytes());
      }
      message(def) {
        return readProtobufMessage(this.bytes(), def);
      }
      int32() {
        this.#expect(VARINT);
        return this.#reader.varint();
      }
      uint32() {
        return this.int32();
      }
      bool() {
        return this.int32() !== 0;
      }
      uint64() {
        this.#expect(VARINT);
        return this.#reader.varintBig();
      }
      sint64() {
        const value = this.uint64();
        return value >> 1n ^ -(value & 1n);
      }
      double() {
        this.#expect(FIXED_64);
        return this.#reader.double();
      }
      maybeSkip() {
        if (this.#wireType < 0) {
          return;
        } else if (this.#wireType === VARINT) {
          this.#reader.skipVarint();
        } else if (this.#wireType === FIXED_64) {
          this.#reader.skip(8);
        } else if (this.#wireType === LENGTH_DELIMITED) {
          const length = this.#reader.varint();
          this.#reader.skip(length);
        } else if (this.#wireType === FIXED_32) {
          this.#reader.skip(4);
        } else {
          throw new ProtoError(`Unexpected wire type ${this.#wireType}`);
        }
        this.#wireType = -1;
      }
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/encode.js
function writeProtobufMessage(value, fun) {
  const w = new MessageWriter();
  fun(w, value);
  return w.data();
}
var MessageWriter;
var init_encode2 = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/encoding/protobuf/encode.js"() {
    init_util2();
    MessageWriter = class _MessageWriter {
      #buf;
      #array;
      #view;
      #pos;
      constructor() {
        this.#buf = new ArrayBuffer(256);
        this.#array = new Uint8Array(this.#buf);
        this.#view = new DataView(this.#buf);
        this.#pos = 0;
      }
      #ensure(extra) {
        if (this.#pos + extra <= this.#buf.byteLength) {
          return;
        }
        let newCap = this.#buf.byteLength;
        while (newCap < this.#pos + extra) {
          newCap *= 2;
        }
        const newBuf = new ArrayBuffer(newCap);
        const newArray = new Uint8Array(newBuf);
        const newView = new DataView(newBuf);
        newArray.set(new Uint8Array(this.#buf, 0, this.#pos));
        this.#buf = newBuf;
        this.#array = newArray;
        this.#view = newView;
      }
      #varint(value) {
        this.#ensure(5);
        value = 0 | value;
        do {
          let byte = value & 127;
          value >>>= 7;
          byte |= value ? 128 : 0;
          this.#array[this.#pos++] = byte;
        } while (value);
      }
      #varintBig(value) {
        this.#ensure(10);
        value = value & 0xffffffffffffffffn;
        do {
          let byte = Number(value & 0x7fn);
          value >>= 7n;
          byte |= value ? 128 : 0;
          this.#array[this.#pos++] = byte;
        } while (value);
      }
      #tag(tag, wireType) {
        this.#varint(tag << 3 | wireType);
      }
      bytes(tag, value) {
        this.#tag(tag, LENGTH_DELIMITED);
        this.#varint(value.byteLength);
        this.#ensure(value.byteLength);
        this.#array.set(value, this.#pos);
        this.#pos += value.byteLength;
      }
      string(tag, value) {
        this.bytes(tag, new TextEncoder().encode(value));
      }
      message(tag, value, fun) {
        const writer = new _MessageWriter();
        fun(writer, value);
        this.bytes(tag, writer.data());
      }
      int32(tag, value) {
        this.#tag(tag, VARINT);
        this.#varint(value);
      }
      uint32(tag, value) {
        this.int32(tag, value);
      }
      bool(tag, value) {
        this.int32(tag, value ? 1 : 0);
      }
      sint64(tag, value) {
        this.#tag(tag, VARINT);
        this.#varintBig(value << 1n ^ value >> 63n);
      }
      double(tag, value) {
        this.#tag(tag, FIXED_64);
        this.#ensure(8);
        this.#view.setFloat64(this.#pos, value, true);
        this.#pos += 8;
      }
      data() {
        return new Uint8Array(this.#buf, 0, this.#pos);
      }
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/encoding/index.js
var init_encoding = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/encoding/index.js"() {
    init_decode();
    init_encode();
    init_decode2();
    init_encode2();
  }
});

// node_modules/@libsql/hrana-client/lib-esm/id_alloc.js
var IdAlloc;
var init_id_alloc = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/id_alloc.js"() {
    init_errors2();
    IdAlloc = class {
      // Set of all allocated ids
      #usedIds;
      // Set of all free ids lower than `#usedIds.size`
      #freeIds;
      constructor() {
        this.#usedIds = /* @__PURE__ */ new Set();
        this.#freeIds = /* @__PURE__ */ new Set();
      }
      // Returns an id that was free, and marks it as used.
      alloc() {
        for (const freeId2 of this.#freeIds) {
          this.#freeIds.delete(freeId2);
          this.#usedIds.add(freeId2);
          if (!this.#usedIds.has(this.#usedIds.size - 1)) {
            this.#freeIds.add(this.#usedIds.size - 1);
          }
          return freeId2;
        }
        const freeId = this.#usedIds.size;
        this.#usedIds.add(freeId);
        return freeId;
      }
      free(id) {
        if (!this.#usedIds.delete(id)) {
          throw new InternalError("Freeing an id that is not allocated");
        }
        this.#freeIds.delete(this.#usedIds.size);
        if (id < this.#usedIds.size) {
          this.#freeIds.add(id);
        }
      }
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/util.js
function impossible(value, message) {
  throw new InternalError(message);
}
var init_util3 = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/util.js"() {
    init_errors2();
  }
});

// node_modules/@libsql/hrana-client/lib-esm/value.js
function valueToProto(value) {
  if (value === null) {
    return null;
  } else if (typeof value === "string") {
    return value;
  } else if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new RangeError("Only finite numbers (not Infinity or NaN) can be passed as arguments");
    }
    return value;
  } else if (typeof value === "bigint") {
    if (value < minInteger2 || value > maxInteger2) {
      throw new RangeError("This bigint value is too large to be represented as a 64-bit integer and passed as argument");
    }
    return value;
  } else if (typeof value === "boolean") {
    return value ? 1n : 0n;
  } else if (value instanceof ArrayBuffer) {
    return new Uint8Array(value);
  } else if (value instanceof Uint8Array) {
    return value;
  } else if (value instanceof Date) {
    return +value.valueOf();
  } else if (typeof value === "object") {
    return "" + value.toString();
  } else {
    throw new TypeError("Unsupported type of value");
  }
}
function valueFromProto(value, intMode) {
  if (value === null) {
    return null;
  } else if (typeof value === "number") {
    return value;
  } else if (typeof value === "string") {
    return value;
  } else if (typeof value === "bigint") {
    if (intMode === "number") {
      const num = Number(value);
      if (!Number.isSafeInteger(num)) {
        throw new RangeError("Received integer which is too large to be safely represented as a JavaScript number");
      }
      return num;
    } else if (intMode === "bigint") {
      return value;
    } else if (intMode === "string") {
      return "" + value;
    } else {
      throw new MisuseError("Invalid value for IntMode");
    }
  } else if (value instanceof Uint8Array) {
    return value.slice().buffer;
  } else if (value === void 0) {
    throw new ProtoError("Received unrecognized type of Value");
  } else {
    throw impossible(value, "Impossible type of Value");
  }
}
var minInteger2, maxInteger2;
var init_value = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/value.js"() {
    init_errors2();
    init_util3();
    minInteger2 = -9223372036854775808n;
    maxInteger2 = 9223372036854775807n;
  }
});

// node_modules/@libsql/hrana-client/lib-esm/result.js
function stmtResultFromProto(result) {
  return {
    affectedRowCount: result.affectedRowCount,
    lastInsertRowid: result.lastInsertRowid,
    columnNames: result.cols.map((col) => col.name),
    columnDecltypes: result.cols.map((col) => col.decltype)
  };
}
function rowsResultFromProto(result, intMode) {
  const stmtResult = stmtResultFromProto(result);
  const rows = result.rows.map((row) => rowFromProto(stmtResult.columnNames, row, intMode));
  return { ...stmtResult, rows };
}
function rowResultFromProto(result, intMode) {
  const stmtResult = stmtResultFromProto(result);
  let row;
  if (result.rows.length > 0) {
    row = rowFromProto(stmtResult.columnNames, result.rows[0], intMode);
  }
  return { ...stmtResult, row };
}
function valueResultFromProto(result, intMode) {
  const stmtResult = stmtResultFromProto(result);
  let value;
  if (result.rows.length > 0 && stmtResult.columnNames.length > 0) {
    value = valueFromProto(result.rows[0][0], intMode);
  }
  return { ...stmtResult, value };
}
function rowFromProto(colNames, values, intMode) {
  const row = {};
  Object.defineProperty(row, "length", { value: values.length });
  for (let i = 0; i < values.length; ++i) {
    const value = valueFromProto(values[i], intMode);
    Object.defineProperty(row, i, { value });
    const colName = colNames[i];
    if (colName !== void 0 && !Object.hasOwn(row, colName)) {
      Object.defineProperty(row, colName, { value, enumerable: true, configurable: true, writable: true });
    }
  }
  return row;
}
function errorFromProto(error) {
  return new ResponseError(error.message, error);
}
var init_result = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/result.js"() {
    init_errors2();
    init_value();
  }
});

// node_modules/@libsql/hrana-client/lib-esm/sql.js
function sqlToProto(owner, sql2) {
  if (sql2 instanceof Sql) {
    return { sqlId: sql2._getSqlId(owner) };
  } else {
    return { sql: "" + sql2 };
  }
}
var Sql;
var init_sql3 = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/sql.js"() {
    init_errors2();
    Sql = class {
      #owner;
      #sqlId;
      #closed;
      /** @private */
      constructor(owner, sqlId) {
        this.#owner = owner;
        this.#sqlId = sqlId;
        this.#closed = void 0;
      }
      /** @private */
      _getSqlId(owner) {
        if (this.#owner !== owner) {
          throw new MisuseError("Attempted to use SQL text opened with other object");
        } else if (this.#closed !== void 0) {
          throw new ClosedError("SQL text is closed", this.#closed);
        }
        return this.#sqlId;
      }
      /** Remove the SQL text from the server, releasing resouces. */
      close() {
        this._setClosed(new ClientError("SQL text was manually closed"));
      }
      /** @private */
      _setClosed(error) {
        if (this.#closed === void 0) {
          this.#closed = error;
          this.#owner._closeSql(this.#sqlId);
        }
      }
      /** True if the SQL text is closed (removed from the server). */
      get closed() {
        return this.#closed !== void 0;
      }
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/queue.js
var Queue;
var init_queue = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/queue.js"() {
    Queue = class {
      #pushStack;
      #shiftStack;
      constructor() {
        this.#pushStack = [];
        this.#shiftStack = [];
      }
      get length() {
        return this.#pushStack.length + this.#shiftStack.length;
      }
      push(elem) {
        this.#pushStack.push(elem);
      }
      shift() {
        if (this.#shiftStack.length === 0 && this.#pushStack.length > 0) {
          this.#shiftStack = this.#pushStack.reverse();
          this.#pushStack = [];
        }
        return this.#shiftStack.pop();
      }
      first() {
        return this.#shiftStack.length !== 0 ? this.#shiftStack[this.#shiftStack.length - 1] : this.#pushStack[0];
      }
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/stmt.js
function stmtToProto(sqlOwner, stmt, wantRows) {
  let inSql;
  let args2 = [];
  let namedArgs = [];
  if (stmt instanceof Stmt) {
    inSql = stmt.sql;
    args2 = stmt._args;
    for (const [name, value] of stmt._namedArgs.entries()) {
      namedArgs.push({ name, value });
    }
  } else if (Array.isArray(stmt)) {
    inSql = stmt[0];
    if (Array.isArray(stmt[1])) {
      args2 = stmt[1].map((arg) => valueToProto(arg));
    } else {
      namedArgs = Object.entries(stmt[1]).map(([name, value]) => {
        return { name, value: valueToProto(value) };
      });
    }
  } else {
    inSql = stmt;
  }
  const { sql: sql2, sqlId } = sqlToProto(sqlOwner, inSql);
  return { sql: sql2, sqlId, args: args2, namedArgs, wantRows };
}
var Stmt;
var init_stmt = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/stmt.js"() {
    init_sql3();
    init_value();
    Stmt = class {
      /** The SQL statement text. */
      sql;
      /** @private */
      _args;
      /** @private */
      _namedArgs;
      /** Initialize the statement with given SQL text. */
      constructor(sql2) {
        this.sql = sql2;
        this._args = [];
        this._namedArgs = /* @__PURE__ */ new Map();
      }
      /** Binds positional parameters from the given `values`. All previous positional bindings are cleared. */
      bindIndexes(values) {
        this._args.length = 0;
        for (const value of values) {
          this._args.push(valueToProto(value));
        }
        return this;
      }
      /** Binds a parameter by a 1-based index. */
      bindIndex(index, value) {
        if (index !== (index | 0) || index <= 0) {
          throw new RangeError("Index of a positional argument must be positive integer");
        }
        while (this._args.length < index) {
          this._args.push(null);
        }
        this._args[index - 1] = valueToProto(value);
        return this;
      }
      /** Binds a parameter by name. */
      bindName(name, value) {
        this._namedArgs.set(name, valueToProto(value));
        return this;
      }
      /** Clears all bindings. */
      unbindAll() {
        this._args.length = 0;
        this._namedArgs.clear();
        return this;
      }
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/batch.js
function executeRegular(stream, steps, batch) {
  return stream._batch(batch).then((result) => {
    for (let step = 0; step < steps.length; ++step) {
      const stepResult = result.stepResults.get(step);
      const stepError = result.stepErrors.get(step);
      steps[step].callback(stepResult, stepError);
    }
  });
}
async function executeCursor(stream, steps, batch) {
  const cursor = await stream._openCursor(batch);
  try {
    let nextStep = 0;
    let beginEntry = void 0;
    let rows = [];
    for (; ; ) {
      const entry = await cursor.next();
      if (entry === void 0) {
        break;
      }
      if (entry.type === "step_begin") {
        if (entry.step < nextStep || entry.step >= steps.length) {
          throw new ProtoError("Server produced StepBeginEntry for unexpected step");
        } else if (beginEntry !== void 0) {
          throw new ProtoError("Server produced StepBeginEntry before terminating previous step");
        }
        for (let step = nextStep; step < entry.step; ++step) {
          steps[step].callback(void 0, void 0);
        }
        nextStep = entry.step + 1;
        beginEntry = entry;
        rows = [];
      } else if (entry.type === "step_end") {
        if (beginEntry === void 0) {
          throw new ProtoError("Server produced StepEndEntry but no step is active");
        }
        const stmtResult = {
          cols: beginEntry.cols,
          rows,
          affectedRowCount: entry.affectedRowCount,
          lastInsertRowid: entry.lastInsertRowid
        };
        steps[beginEntry.step].callback(stmtResult, void 0);
        beginEntry = void 0;
        rows = [];
      } else if (entry.type === "step_error") {
        if (beginEntry === void 0) {
          if (entry.step >= steps.length) {
            throw new ProtoError("Server produced StepErrorEntry for unexpected step");
          }
          for (let step = nextStep; step < entry.step; ++step) {
            steps[step].callback(void 0, void 0);
          }
        } else {
          if (entry.step !== beginEntry.step) {
            throw new ProtoError("Server produced StepErrorEntry for unexpected step");
          }
          beginEntry = void 0;
          rows = [];
        }
        steps[entry.step].callback(void 0, entry.error);
        nextStep = entry.step + 1;
      } else if (entry.type === "row") {
        if (beginEntry === void 0) {
          throw new ProtoError("Server produced RowEntry but no step is active");
        }
        rows.push(entry.row);
      } else if (entry.type === "error") {
        throw errorFromProto(entry.error);
      } else if (entry.type === "none") {
        throw new ProtoError("Server produced unrecognized CursorEntry");
      } else {
        throw impossible(entry, "Impossible CursorEntry");
      }
    }
    if (beginEntry !== void 0) {
      throw new ProtoError("Server closed Cursor before terminating active step");
    }
    for (let step = nextStep; step < steps.length; ++step) {
      steps[step].callback(void 0, void 0);
    }
  } finally {
    cursor.close();
  }
}
function stepIndex(step) {
  if (step._index === void 0) {
    throw new MisuseError("Cannot add a condition referencing a step that has not been added to the batch");
  }
  return step._index;
}
function checkCondBatch(expectedBatch, cond) {
  if (cond._batch !== expectedBatch) {
    throw new MisuseError("Cannot mix BatchCond objects for different Batch objects");
  }
}
var Batch, BatchStep, BatchCond;
var init_batch = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/batch.js"() {
    init_errors2();
    init_result();
    init_stmt();
    init_util3();
    Batch = class {
      /** @private */
      _stream;
      #useCursor;
      /** @private */
      _steps;
      #executed;
      /** @private */
      constructor(stream, useCursor) {
        this._stream = stream;
        this.#useCursor = useCursor;
        this._steps = [];
        this.#executed = false;
      }
      /** Return a builder for adding a step to the batch. */
      step() {
        return new BatchStep(this);
      }
      /** Execute the batch. */
      execute() {
        if (this.#executed) {
          throw new MisuseError("This batch has already been executed");
        }
        this.#executed = true;
        const batch = {
          steps: this._steps.map((step) => step.proto)
        };
        if (this.#useCursor) {
          return executeCursor(this._stream, this._steps, batch);
        } else {
          return executeRegular(this._stream, this._steps, batch);
        }
      }
    };
    BatchStep = class {
      /** @private */
      _batch;
      #conds;
      /** @private */
      _index;
      /** @private */
      constructor(batch) {
        this._batch = batch;
        this.#conds = [];
        this._index = void 0;
      }
      /** Add the condition that needs to be satisfied to execute the statement. If you use this method multiple
       * times, we join the conditions with a logical AND. */
      condition(cond) {
        this.#conds.push(cond._proto);
        return this;
      }
      /** Add a statement that returns rows. */
      query(stmt) {
        return this.#add(stmt, true, rowsResultFromProto);
      }
      /** Add a statement that returns at most a single row. */
      queryRow(stmt) {
        return this.#add(stmt, true, rowResultFromProto);
      }
      /** Add a statement that returns at most a single value. */
      queryValue(stmt) {
        return this.#add(stmt, true, valueResultFromProto);
      }
      /** Add a statement without returning rows. */
      run(stmt) {
        return this.#add(stmt, false, stmtResultFromProto);
      }
      #add(inStmt, wantRows, fromProto) {
        if (this._index !== void 0) {
          throw new MisuseError("This BatchStep has already been added to the batch");
        }
        const stmt = stmtToProto(this._batch._stream._sqlOwner(), inStmt, wantRows);
        let condition;
        if (this.#conds.length === 0) {
          condition = void 0;
        } else if (this.#conds.length === 1) {
          condition = this.#conds[0];
        } else {
          condition = { type: "and", conds: this.#conds.slice() };
        }
        const proto = { stmt, condition };
        return new Promise((outputCallback, errorCallback) => {
          const callback = (stepResult, stepError) => {
            if (stepResult !== void 0 && stepError !== void 0) {
              errorCallback(new ProtoError("Server returned both result and error"));
            } else if (stepError !== void 0) {
              errorCallback(errorFromProto(stepError));
            } else if (stepResult !== void 0) {
              outputCallback(fromProto(stepResult, this._batch._stream.intMode));
            } else {
              outputCallback(void 0);
            }
          };
          this._index = this._batch._steps.length;
          this._batch._steps.push({ proto, callback });
        });
      }
    };
    BatchCond = class _BatchCond {
      /** @private */
      _batch;
      /** @private */
      _proto;
      /** @private */
      constructor(batch, proto) {
        this._batch = batch;
        this._proto = proto;
      }
      /** Create a condition that evaluates to true when the given step executes successfully.
       *
       * If the given step fails error or is skipped because its condition evaluated to false, this
       * condition evaluates to false.
       */
      static ok(step) {
        return new _BatchCond(step._batch, { type: "ok", step: stepIndex(step) });
      }
      /** Create a condition that evaluates to true when the given step fails.
       *
       * If the given step succeeds or is skipped because its condition evaluated to false, this condition
       * evaluates to false.
       */
      static error(step) {
        return new _BatchCond(step._batch, { type: "error", step: stepIndex(step) });
      }
      /** Create a condition that is a logical negation of another condition.
       */
      static not(cond) {
        return new _BatchCond(cond._batch, { type: "not", cond: cond._proto });
      }
      /** Create a condition that is a logical AND of other conditions.
       */
      static and(batch, conds) {
        for (const cond of conds) {
          checkCondBatch(batch, cond);
        }
        return new _BatchCond(batch, { type: "and", conds: conds.map((e) => e._proto) });
      }
      /** Create a condition that is a logical OR of other conditions.
       */
      static or(batch, conds) {
        for (const cond of conds) {
          checkCondBatch(batch, cond);
        }
        return new _BatchCond(batch, { type: "or", conds: conds.map((e) => e._proto) });
      }
      /** Create a condition that evaluates to true when the SQL connection is in autocommit mode (not inside an
       * explicit transaction). This requires protocol version 3 or higher.
       */
      static isAutocommit(batch) {
        batch._stream.client()._ensureVersion(3, "BatchCond.isAutocommit()");
        return new _BatchCond(batch, { type: "is_autocommit" });
      }
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/describe.js
function describeResultFromProto(result) {
  return {
    paramNames: result.params.map((p) => p.name),
    columns: result.cols,
    isExplain: result.isExplain,
    isReadonly: result.isReadonly
  };
}
var init_describe = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/describe.js"() {
  }
});

// node_modules/@libsql/hrana-client/lib-esm/stream.js
var Stream;
var init_stream = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/stream.js"() {
    init_batch();
    init_describe();
    init_result();
    init_sql3();
    init_stmt();
    Stream = class {
      /** @private */
      constructor(intMode) {
        this.intMode = intMode;
      }
      /** Execute a statement and return rows. */
      query(stmt) {
        return this.#execute(stmt, true, rowsResultFromProto);
      }
      /** Execute a statement and return at most a single row. */
      queryRow(stmt) {
        return this.#execute(stmt, true, rowResultFromProto);
      }
      /** Execute a statement and return at most a single value. */
      queryValue(stmt) {
        return this.#execute(stmt, true, valueResultFromProto);
      }
      /** Execute a statement without returning rows. */
      run(stmt) {
        return this.#execute(stmt, false, stmtResultFromProto);
      }
      #execute(inStmt, wantRows, fromProto) {
        const stmt = stmtToProto(this._sqlOwner(), inStmt, wantRows);
        return this._execute(stmt).then((r) => fromProto(r, this.intMode));
      }
      /** Return a builder for creating and executing a batch.
       *
       * If `useCursor` is true, the batch will be executed using a Hrana cursor, which will stream results from
       * the server to the client, which consumes less memory on the server. This requires protocol version 3 or
       * higher.
       */
      batch(useCursor = false) {
        return new Batch(this, useCursor);
      }
      /** Parse and analyze a statement. This requires protocol version 2 or higher. */
      describe(inSql) {
        const protoSql = sqlToProto(this._sqlOwner(), inSql);
        return this._describe(protoSql).then(describeResultFromProto);
      }
      /** Execute a sequence of statements separated by semicolons. This requires protocol version 2 or higher.
       * */
      sequence(inSql) {
        const protoSql = sqlToProto(this._sqlOwner(), inSql);
        return this._sequence(protoSql);
      }
      /** Representation of integers returned from the database. See {@link IntMode}.
       *
       * This value affects the results of all operations on this stream.
       */
      intMode;
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/cursor.js
var Cursor;
var init_cursor = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/cursor.js"() {
    Cursor = class {
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/ws/cursor.js
var fetchChunkSize, fetchQueueSize, WsCursor;
var init_cursor2 = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/ws/cursor.js"() {
    init_errors2();
    init_cursor();
    init_queue();
    fetchChunkSize = 1e3;
    fetchQueueSize = 10;
    WsCursor = class extends Cursor {
      #client;
      #stream;
      #cursorId;
      #entryQueue;
      #fetchQueue;
      #closed;
      #done;
      /** @private */
      constructor(client, stream, cursorId) {
        super();
        this.#client = client;
        this.#stream = stream;
        this.#cursorId = cursorId;
        this.#entryQueue = new Queue();
        this.#fetchQueue = new Queue();
        this.#closed = void 0;
        this.#done = false;
      }
      /** Fetch the next entry from the cursor. */
      async next() {
        for (; ; ) {
          if (this.#closed !== void 0) {
            throw new ClosedError("Cursor is closed", this.#closed);
          }
          while (!this.#done && this.#fetchQueue.length < fetchQueueSize) {
            this.#fetchQueue.push(this.#fetch());
          }
          const entry = this.#entryQueue.shift();
          if (this.#done || entry !== void 0) {
            return entry;
          }
          await this.#fetchQueue.shift().then((response) => {
            if (response === void 0) {
              return;
            }
            for (const entry2 of response.entries) {
              this.#entryQueue.push(entry2);
            }
            this.#done ||= response.done;
          });
        }
      }
      #fetch() {
        return this.#stream._sendCursorRequest(this, {
          type: "fetch_cursor",
          cursorId: this.#cursorId,
          maxCount: fetchChunkSize
        }).then((resp) => resp, (error) => {
          this._setClosed(error);
          return void 0;
        });
      }
      /** @private */
      _setClosed(error) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#closed = error;
        this.#stream._sendCursorRequest(this, {
          type: "close_cursor",
          cursorId: this.#cursorId
        }).catch(() => void 0);
        this.#stream._cursorClosed(this);
      }
      /** Close the cursor. */
      close() {
        this._setClosed(new ClientError("Cursor was manually closed"));
      }
      /** True if the cursor is closed. */
      get closed() {
        return this.#closed !== void 0;
      }
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/ws/stream.js
var WsStream;
var init_stream2 = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/ws/stream.js"() {
    init_errors2();
    init_queue();
    init_stream();
    init_cursor2();
    WsStream = class _WsStream extends Stream {
      #client;
      #streamId;
      #queue;
      #cursor;
      #closing;
      #closed;
      /** @private */
      static open(client) {
        const streamId = client._streamIdAlloc.alloc();
        const stream = new _WsStream(client, streamId);
        const responseCallback = () => void 0;
        const errorCallback = (e) => stream.#setClosed(e);
        const request = { type: "open_stream", streamId };
        client._sendRequest(request, { responseCallback, errorCallback });
        return stream;
      }
      /** @private */
      constructor(client, streamId) {
        super(client.intMode);
        this.#client = client;
        this.#streamId = streamId;
        this.#queue = new Queue();
        this.#cursor = void 0;
        this.#closing = false;
        this.#closed = void 0;
      }
      /** Get the {@link WsClient} object that this stream belongs to. */
      client() {
        return this.#client;
      }
      /** @private */
      _sqlOwner() {
        return this.#client;
      }
      /** @private */
      _execute(stmt) {
        return this.#sendStreamRequest({
          type: "execute",
          streamId: this.#streamId,
          stmt
        }).then((response) => {
          return response.result;
        });
      }
      /** @private */
      _batch(batch) {
        return this.#sendStreamRequest({
          type: "batch",
          streamId: this.#streamId,
          batch
        }).then((response) => {
          return response.result;
        });
      }
      /** @private */
      _describe(protoSql) {
        this.#client._ensureVersion(2, "describe()");
        return this.#sendStreamRequest({
          type: "describe",
          streamId: this.#streamId,
          sql: protoSql.sql,
          sqlId: protoSql.sqlId
        }).then((response) => {
          return response.result;
        });
      }
      /** @private */
      _sequence(protoSql) {
        this.#client._ensureVersion(2, "sequence()");
        return this.#sendStreamRequest({
          type: "sequence",
          streamId: this.#streamId,
          sql: protoSql.sql,
          sqlId: protoSql.sqlId
        }).then((_response) => {
          return void 0;
        });
      }
      /** Check whether the SQL connection underlying this stream is in autocommit state (i.e., outside of an
       * explicit transaction). This requires protocol version 3 or higher.
       */
      getAutocommit() {
        this.#client._ensureVersion(3, "getAutocommit()");
        return this.#sendStreamRequest({
          type: "get_autocommit",
          streamId: this.#streamId
        }).then((response) => {
          return response.isAutocommit;
        });
      }
      #sendStreamRequest(request) {
        return new Promise((responseCallback, errorCallback) => {
          this.#pushToQueue({ type: "request", request, responseCallback, errorCallback });
        });
      }
      /** @private */
      _openCursor(batch) {
        this.#client._ensureVersion(3, "cursor");
        return new Promise((cursorCallback, errorCallback) => {
          this.#pushToQueue({ type: "cursor", batch, cursorCallback, errorCallback });
        });
      }
      /** @private */
      _sendCursorRequest(cursor, request) {
        if (cursor !== this.#cursor) {
          throw new InternalError("Cursor not associated with the stream attempted to execute a request");
        }
        return new Promise((responseCallback, errorCallback) => {
          if (this.#closed !== void 0) {
            errorCallback(new ClosedError("Stream is closed", this.#closed));
          } else {
            this.#client._sendRequest(request, { responseCallback, errorCallback });
          }
        });
      }
      /** @private */
      _cursorClosed(cursor) {
        if (cursor !== this.#cursor) {
          throw new InternalError("Cursor was closed, but it was not associated with the stream");
        }
        this.#cursor = void 0;
        this.#flushQueue();
      }
      #pushToQueue(entry) {
        if (this.#closed !== void 0) {
          entry.errorCallback(new ClosedError("Stream is closed", this.#closed));
        } else if (this.#closing) {
          entry.errorCallback(new ClosedError("Stream is closing", void 0));
        } else {
          this.#queue.push(entry);
          this.#flushQueue();
        }
      }
      #flushQueue() {
        for (; ; ) {
          const entry = this.#queue.first();
          if (entry === void 0 && this.#cursor === void 0 && this.#closing) {
            this.#setClosed(new ClientError("Stream was gracefully closed"));
            break;
          } else if (entry?.type === "request" && this.#cursor === void 0) {
            const { request, responseCallback, errorCallback } = entry;
            this.#queue.shift();
            this.#client._sendRequest(request, { responseCallback, errorCallback });
          } else if (entry?.type === "cursor" && this.#cursor === void 0) {
            const { batch, cursorCallback } = entry;
            this.#queue.shift();
            const cursorId = this.#client._cursorIdAlloc.alloc();
            const cursor = new WsCursor(this.#client, this, cursorId);
            const request = {
              type: "open_cursor",
              streamId: this.#streamId,
              cursorId,
              batch
            };
            const responseCallback = () => void 0;
            const errorCallback = (e) => cursor._setClosed(e);
            this.#client._sendRequest(request, { responseCallback, errorCallback });
            this.#cursor = cursor;
            cursorCallback(cursor);
          } else {
            break;
          }
        }
      }
      #setClosed(error) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#closed = error;
        if (this.#cursor !== void 0) {
          this.#cursor._setClosed(error);
        }
        for (; ; ) {
          const entry = this.#queue.shift();
          if (entry !== void 0) {
            entry.errorCallback(error);
          } else {
            break;
          }
        }
        const request = { type: "close_stream", streamId: this.#streamId };
        const responseCallback = () => this.#client._streamIdAlloc.free(this.#streamId);
        const errorCallback = () => void 0;
        this.#client._sendRequest(request, { responseCallback, errorCallback });
      }
      /** Immediately close the stream. */
      close() {
        this.#setClosed(new ClientError("Stream was manually closed"));
      }
      /** Gracefully close the stream. */
      closeGracefully() {
        this.#closing = true;
        this.#flushQueue();
      }
      /** True if the stream is closed or closing. */
      get closed() {
        return this.#closed !== void 0 || this.#closing;
      }
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/shared/json_encode.js
function Stmt2(w, msg) {
  if (msg.sql !== void 0) {
    w.string("sql", msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.number("sql_id", msg.sqlId);
  }
  w.arrayObjects("args", msg.args, Value);
  w.arrayObjects("named_args", msg.namedArgs, NamedArg);
  w.boolean("want_rows", msg.wantRows);
}
function NamedArg(w, msg) {
  w.string("name", msg.name);
  w.object("value", msg.value, Value);
}
function Batch2(w, msg) {
  w.arrayObjects("steps", msg.steps, BatchStep2);
}
function BatchStep2(w, msg) {
  if (msg.condition !== void 0) {
    w.object("condition", msg.condition, BatchCond2);
  }
  w.object("stmt", msg.stmt, Stmt2);
}
function BatchCond2(w, msg) {
  w.stringRaw("type", msg.type);
  if (msg.type === "ok" || msg.type === "error") {
    w.number("step", msg.step);
  } else if (msg.type === "not") {
    w.object("cond", msg.cond, BatchCond2);
  } else if (msg.type === "and" || msg.type === "or") {
    w.arrayObjects("conds", msg.conds, BatchCond2);
  } else if (msg.type === "is_autocommit") {
  } else {
    throw impossible(msg, "Impossible type of BatchCond");
  }
}
function Value(w, msg) {
  if (msg === null) {
    w.stringRaw("type", "null");
  } else if (typeof msg === "bigint") {
    w.stringRaw("type", "integer");
    w.stringRaw("value", "" + msg);
  } else if (typeof msg === "number") {
    w.stringRaw("type", "float");
    w.number("value", msg);
  } else if (typeof msg === "string") {
    w.stringRaw("type", "text");
    w.string("value", msg);
  } else if (msg instanceof Uint8Array) {
    w.stringRaw("type", "blob");
    w.stringRaw("base64", gBase64.fromUint8Array(msg));
  } else if (msg === void 0) {
  } else {
    throw impossible(msg, "Impossible type of Value");
  }
}
var init_json_encode = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/shared/json_encode.js"() {
    init_base64();
    init_util3();
  }
});

// node_modules/@libsql/hrana-client/lib-esm/ws/json_encode.js
function ClientMsg(w, msg) {
  w.stringRaw("type", msg.type);
  if (msg.type === "hello") {
    if (msg.jwt !== void 0) {
      w.string("jwt", msg.jwt);
    }
  } else if (msg.type === "request") {
    w.number("request_id", msg.requestId);
    w.object("request", msg.request, Request2);
  } else {
    throw impossible(msg, "Impossible type of ClientMsg");
  }
}
function Request2(w, msg) {
  w.stringRaw("type", msg.type);
  if (msg.type === "open_stream") {
    w.number("stream_id", msg.streamId);
  } else if (msg.type === "close_stream") {
    w.number("stream_id", msg.streamId);
  } else if (msg.type === "execute") {
    w.number("stream_id", msg.streamId);
    w.object("stmt", msg.stmt, Stmt2);
  } else if (msg.type === "batch") {
    w.number("stream_id", msg.streamId);
    w.object("batch", msg.batch, Batch2);
  } else if (msg.type === "open_cursor") {
    w.number("stream_id", msg.streamId);
    w.number("cursor_id", msg.cursorId);
    w.object("batch", msg.batch, Batch2);
  } else if (msg.type === "close_cursor") {
    w.number("cursor_id", msg.cursorId);
  } else if (msg.type === "fetch_cursor") {
    w.number("cursor_id", msg.cursorId);
    w.number("max_count", msg.maxCount);
  } else if (msg.type === "sequence") {
    w.number("stream_id", msg.streamId);
    if (msg.sql !== void 0) {
      w.string("sql", msg.sql);
    }
    if (msg.sqlId !== void 0) {
      w.number("sql_id", msg.sqlId);
    }
  } else if (msg.type === "describe") {
    w.number("stream_id", msg.streamId);
    if (msg.sql !== void 0) {
      w.string("sql", msg.sql);
    }
    if (msg.sqlId !== void 0) {
      w.number("sql_id", msg.sqlId);
    }
  } else if (msg.type === "store_sql") {
    w.number("sql_id", msg.sqlId);
    w.string("sql", msg.sql);
  } else if (msg.type === "close_sql") {
    w.number("sql_id", msg.sqlId);
  } else if (msg.type === "get_autocommit") {
    w.number("stream_id", msg.streamId);
  } else {
    throw impossible(msg, "Impossible type of Request");
  }
}
var init_json_encode2 = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/ws/json_encode.js"() {
    init_json_encode();
    init_util3();
  }
});

// node_modules/@libsql/hrana-client/lib-esm/shared/protobuf_encode.js
function Stmt3(w, msg) {
  if (msg.sql !== void 0) {
    w.string(1, msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.int32(2, msg.sqlId);
  }
  for (const arg of msg.args) {
    w.message(3, arg, Value2);
  }
  for (const arg of msg.namedArgs) {
    w.message(4, arg, NamedArg2);
  }
  w.bool(5, msg.wantRows);
}
function NamedArg2(w, msg) {
  w.string(1, msg.name);
  w.message(2, msg.value, Value2);
}
function Batch3(w, msg) {
  for (const step of msg.steps) {
    w.message(1, step, BatchStep3);
  }
}
function BatchStep3(w, msg) {
  if (msg.condition !== void 0) {
    w.message(1, msg.condition, BatchCond3);
  }
  w.message(2, msg.stmt, Stmt3);
}
function BatchCond3(w, msg) {
  if (msg.type === "ok") {
    w.uint32(1, msg.step);
  } else if (msg.type === "error") {
    w.uint32(2, msg.step);
  } else if (msg.type === "not") {
    w.message(3, msg.cond, BatchCond3);
  } else if (msg.type === "and") {
    w.message(4, msg.conds, BatchCondList);
  } else if (msg.type === "or") {
    w.message(5, msg.conds, BatchCondList);
  } else if (msg.type === "is_autocommit") {
    w.message(6, void 0, Empty);
  } else {
    throw impossible(msg, "Impossible type of BatchCond");
  }
}
function BatchCondList(w, msg) {
  for (const cond of msg) {
    w.message(1, cond, BatchCond3);
  }
}
function Value2(w, msg) {
  if (msg === null) {
    w.message(1, void 0, Empty);
  } else if (typeof msg === "bigint") {
    w.sint64(2, msg);
  } else if (typeof msg === "number") {
    w.double(3, msg);
  } else if (typeof msg === "string") {
    w.string(4, msg);
  } else if (msg instanceof Uint8Array) {
    w.bytes(5, msg);
  } else if (msg === void 0) {
  } else {
    throw impossible(msg, "Impossible type of Value");
  }
}
function Empty(_w, _msg) {
}
var init_protobuf_encode = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/shared/protobuf_encode.js"() {
    init_util3();
  }
});

// node_modules/@libsql/hrana-client/lib-esm/ws/protobuf_encode.js
function ClientMsg2(w, msg) {
  if (msg.type === "hello") {
    w.message(1, msg, HelloMsg);
  } else if (msg.type === "request") {
    w.message(2, msg, RequestMsg);
  } else {
    throw impossible(msg, "Impossible type of ClientMsg");
  }
}
function HelloMsg(w, msg) {
  if (msg.jwt !== void 0) {
    w.string(1, msg.jwt);
  }
}
function RequestMsg(w, msg) {
  w.int32(1, msg.requestId);
  const request = msg.request;
  if (request.type === "open_stream") {
    w.message(2, request, OpenStreamReq);
  } else if (request.type === "close_stream") {
    w.message(3, request, CloseStreamReq);
  } else if (request.type === "execute") {
    w.message(4, request, ExecuteReq);
  } else if (request.type === "batch") {
    w.message(5, request, BatchReq);
  } else if (request.type === "open_cursor") {
    w.message(6, request, OpenCursorReq);
  } else if (request.type === "close_cursor") {
    w.message(7, request, CloseCursorReq);
  } else if (request.type === "fetch_cursor") {
    w.message(8, request, FetchCursorReq);
  } else if (request.type === "sequence") {
    w.message(9, request, SequenceReq);
  } else if (request.type === "describe") {
    w.message(10, request, DescribeReq);
  } else if (request.type === "store_sql") {
    w.message(11, request, StoreSqlReq);
  } else if (request.type === "close_sql") {
    w.message(12, request, CloseSqlReq);
  } else if (request.type === "get_autocommit") {
    w.message(13, request, GetAutocommitReq);
  } else {
    throw impossible(request, "Impossible type of Request");
  }
}
function OpenStreamReq(w, msg) {
  w.int32(1, msg.streamId);
}
function CloseStreamReq(w, msg) {
  w.int32(1, msg.streamId);
}
function ExecuteReq(w, msg) {
  w.int32(1, msg.streamId);
  w.message(2, msg.stmt, Stmt3);
}
function BatchReq(w, msg) {
  w.int32(1, msg.streamId);
  w.message(2, msg.batch, Batch3);
}
function OpenCursorReq(w, msg) {
  w.int32(1, msg.streamId);
  w.int32(2, msg.cursorId);
  w.message(3, msg.batch, Batch3);
}
function CloseCursorReq(w, msg) {
  w.int32(1, msg.cursorId);
}
function FetchCursorReq(w, msg) {
  w.int32(1, msg.cursorId);
  w.uint32(2, msg.maxCount);
}
function SequenceReq(w, msg) {
  w.int32(1, msg.streamId);
  if (msg.sql !== void 0) {
    w.string(2, msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.int32(3, msg.sqlId);
  }
}
function DescribeReq(w, msg) {
  w.int32(1, msg.streamId);
  if (msg.sql !== void 0) {
    w.string(2, msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.int32(3, msg.sqlId);
  }
}
function StoreSqlReq(w, msg) {
  w.int32(1, msg.sqlId);
  w.string(2, msg.sql);
}
function CloseSqlReq(w, msg) {
  w.int32(1, msg.sqlId);
}
function GetAutocommitReq(w, msg) {
  w.int32(1, msg.streamId);
}
var init_protobuf_encode2 = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/ws/protobuf_encode.js"() {
    init_protobuf_encode();
    init_util3();
  }
});

// node_modules/@libsql/hrana-client/lib-esm/shared/json_decode.js
function Error2(obj) {
  const message = string(obj["message"]);
  const code = stringOpt(obj["code"]);
  return { message, code };
}
function StmtResult(obj) {
  const cols = arrayObjectsMap(obj["cols"], Col);
  const rows = array(obj["rows"]).map((rowObj) => arrayObjectsMap(rowObj, Value3));
  const affectedRowCount = number(obj["affected_row_count"]);
  const lastInsertRowidStr = stringOpt(obj["last_insert_rowid"]);
  const lastInsertRowid = lastInsertRowidStr !== void 0 ? BigInt(lastInsertRowidStr) : void 0;
  return { cols, rows, affectedRowCount, lastInsertRowid };
}
function Col(obj) {
  const name = stringOpt(obj["name"]);
  const decltype = stringOpt(obj["decltype"]);
  return { name, decltype };
}
function BatchResult(obj) {
  const stepResults = /* @__PURE__ */ new Map();
  array(obj["step_results"]).forEach((value, i) => {
    if (value !== null) {
      stepResults.set(i, StmtResult(object(value)));
    }
  });
  const stepErrors = /* @__PURE__ */ new Map();
  array(obj["step_errors"]).forEach((value, i) => {
    if (value !== null) {
      stepErrors.set(i, Error2(object(value)));
    }
  });
  return { stepResults, stepErrors };
}
function CursorEntry(obj) {
  const type = string(obj["type"]);
  if (type === "step_begin") {
    const step = number(obj["step"]);
    const cols = arrayObjectsMap(obj["cols"], Col);
    return { type: "step_begin", step, cols };
  } else if (type === "step_end") {
    const affectedRowCount = number(obj["affected_row_count"]);
    const lastInsertRowidStr = stringOpt(obj["last_insert_rowid"]);
    const lastInsertRowid = lastInsertRowidStr !== void 0 ? BigInt(lastInsertRowidStr) : void 0;
    return { type: "step_end", affectedRowCount, lastInsertRowid };
  } else if (type === "step_error") {
    const step = number(obj["step"]);
    const error = Error2(object(obj["error"]));
    return { type: "step_error", step, error };
  } else if (type === "row") {
    const row = arrayObjectsMap(obj["row"], Value3);
    return { type: "row", row };
  } else if (type === "error") {
    const error = Error2(object(obj["error"]));
    return { type: "error", error };
  } else {
    throw new ProtoError("Unexpected type of CursorEntry");
  }
}
function DescribeResult(obj) {
  const params = arrayObjectsMap(obj["params"], DescribeParam);
  const cols = arrayObjectsMap(obj["cols"], DescribeCol);
  const isExplain = boolean(obj["is_explain"]);
  const isReadonly = boolean(obj["is_readonly"]);
  return { params, cols, isExplain, isReadonly };
}
function DescribeParam(obj) {
  const name = stringOpt(obj["name"]);
  return { name };
}
function DescribeCol(obj) {
  const name = string(obj["name"]);
  const decltype = stringOpt(obj["decltype"]);
  return { name, decltype };
}
function Value3(obj) {
  const type = string(obj["type"]);
  if (type === "null") {
    return null;
  } else if (type === "integer") {
    const value = string(obj["value"]);
    return BigInt(value);
  } else if (type === "float") {
    return number(obj["value"]);
  } else if (type === "text") {
    return string(obj["value"]);
  } else if (type === "blob") {
    return gBase64.toUint8Array(string(obj["base64"]));
  } else {
    throw new ProtoError("Unexpected type of Value");
  }
}
var init_json_decode = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/shared/json_decode.js"() {
    init_base64();
    init_errors2();
    init_decode();
  }
});

// node_modules/@libsql/hrana-client/lib-esm/ws/json_decode.js
function ServerMsg(obj) {
  const type = string(obj["type"]);
  if (type === "hello_ok") {
    return { type: "hello_ok" };
  } else if (type === "hello_error") {
    const error = Error2(object(obj["error"]));
    return { type: "hello_error", error };
  } else if (type === "response_ok") {
    const requestId = number(obj["request_id"]);
    const response = Response(object(obj["response"]));
    return { type: "response_ok", requestId, response };
  } else if (type === "response_error") {
    const requestId = number(obj["request_id"]);
    const error = Error2(object(obj["error"]));
    return { type: "response_error", requestId, error };
  } else {
    throw new ProtoError("Unexpected type of ServerMsg");
  }
}
function Response(obj) {
  const type = string(obj["type"]);
  if (type === "open_stream") {
    return { type: "open_stream" };
  } else if (type === "close_stream") {
    return { type: "close_stream" };
  } else if (type === "execute") {
    const result = StmtResult(object(obj["result"]));
    return { type: "execute", result };
  } else if (type === "batch") {
    const result = BatchResult(object(obj["result"]));
    return { type: "batch", result };
  } else if (type === "open_cursor") {
    return { type: "open_cursor" };
  } else if (type === "close_cursor") {
    return { type: "close_cursor" };
  } else if (type === "fetch_cursor") {
    const entries = arrayObjectsMap(obj["entries"], CursorEntry);
    const done = boolean(obj["done"]);
    return { type: "fetch_cursor", entries, done };
  } else if (type === "sequence") {
    return { type: "sequence" };
  } else if (type === "describe") {
    const result = DescribeResult(object(obj["result"]));
    return { type: "describe", result };
  } else if (type === "store_sql") {
    return { type: "store_sql" };
  } else if (type === "close_sql") {
    return { type: "close_sql" };
  } else if (type === "get_autocommit") {
    const isAutocommit = boolean(obj["is_autocommit"]);
    return { type: "get_autocommit", isAutocommit };
  } else {
    throw new ProtoError("Unexpected type of Response");
  }
}
var init_json_decode2 = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/ws/json_decode.js"() {
    init_errors2();
    init_decode();
    init_json_decode();
  }
});

// node_modules/@libsql/hrana-client/lib-esm/shared/protobuf_decode.js
var Error3, StmtResult2, Col2, Row, BatchResult2, BatchResultStepResult, BatchResultStepError, CursorEntry2, StepBeginEntry, StepEndEntry, StepErrorEntry, DescribeResult2, DescribeParam2, DescribeCol2, Value4;
var init_protobuf_decode = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/shared/protobuf_decode.js"() {
    Error3 = {
      default() {
        return { message: "", code: void 0 };
      },
      1(r, msg) {
        msg.message = r.string();
      },
      2(r, msg) {
        msg.code = r.string();
      }
    };
    StmtResult2 = {
      default() {
        return {
          cols: [],
          rows: [],
          affectedRowCount: 0,
          lastInsertRowid: void 0
        };
      },
      1(r, msg) {
        msg.cols.push(r.message(Col2));
      },
      2(r, msg) {
        msg.rows.push(r.message(Row));
      },
      3(r, msg) {
        msg.affectedRowCount = Number(r.uint64());
      },
      4(r, msg) {
        msg.lastInsertRowid = r.sint64();
      }
    };
    Col2 = {
      default() {
        return { name: void 0, decltype: void 0 };
      },
      1(r, msg) {
        msg.name = r.string();
      },
      2(r, msg) {
        msg.decltype = r.string();
      }
    };
    Row = {
      default() {
        return [];
      },
      1(r, msg) {
        msg.push(r.message(Value4));
      }
    };
    BatchResult2 = {
      default() {
        return { stepResults: /* @__PURE__ */ new Map(), stepErrors: /* @__PURE__ */ new Map() };
      },
      1(r, msg) {
        const [key, value] = r.message(BatchResultStepResult);
        msg.stepResults.set(key, value);
      },
      2(r, msg) {
        const [key, value] = r.message(BatchResultStepError);
        msg.stepErrors.set(key, value);
      }
    };
    BatchResultStepResult = {
      default() {
        return [0, StmtResult2.default()];
      },
      1(r, msg) {
        msg[0] = r.uint32();
      },
      2(r, msg) {
        msg[1] = r.message(StmtResult2);
      }
    };
    BatchResultStepError = {
      default() {
        return [0, Error3.default()];
      },
      1(r, msg) {
        msg[0] = r.uint32();
      },
      2(r, msg) {
        msg[1] = r.message(Error3);
      }
    };
    CursorEntry2 = {
      default() {
        return { type: "none" };
      },
      1(r) {
        return r.message(StepBeginEntry);
      },
      2(r) {
        return r.message(StepEndEntry);
      },
      3(r) {
        return r.message(StepErrorEntry);
      },
      4(r) {
        return { type: "row", row: r.message(Row) };
      },
      5(r) {
        return { type: "error", error: r.message(Error3) };
      }
    };
    StepBeginEntry = {
      default() {
        return { type: "step_begin", step: 0, cols: [] };
      },
      1(r, msg) {
        msg.step = r.uint32();
      },
      2(r, msg) {
        msg.cols.push(r.message(Col2));
      }
    };
    StepEndEntry = {
      default() {
        return {
          type: "step_end",
          affectedRowCount: 0,
          lastInsertRowid: void 0
        };
      },
      1(r, msg) {
        msg.affectedRowCount = r.uint32();
      },
      2(r, msg) {
        msg.lastInsertRowid = r.uint64();
      }
    };
    StepErrorEntry = {
      default() {
        return {
          type: "step_error",
          step: 0,
          error: Error3.default()
        };
      },
      1(r, msg) {
        msg.step = r.uint32();
      },
      2(r, msg) {
        msg.error = r.message(Error3);
      }
    };
    DescribeResult2 = {
      default() {
        return {
          params: [],
          cols: [],
          isExplain: false,
          isReadonly: false
        };
      },
      1(r, msg) {
        msg.params.push(r.message(DescribeParam2));
      },
      2(r, msg) {
        msg.cols.push(r.message(DescribeCol2));
      },
      3(r, msg) {
        msg.isExplain = r.bool();
      },
      4(r, msg) {
        msg.isReadonly = r.bool();
      }
    };
    DescribeParam2 = {
      default() {
        return { name: void 0 };
      },
      1(r, msg) {
        msg.name = r.string();
      }
    };
    DescribeCol2 = {
      default() {
        return { name: "", decltype: void 0 };
      },
      1(r, msg) {
        msg.name = r.string();
      },
      2(r, msg) {
        msg.decltype = r.string();
      }
    };
    Value4 = {
      default() {
        return void 0;
      },
      1(r) {
        return null;
      },
      2(r) {
        return r.sint64();
      },
      3(r) {
        return r.double();
      },
      4(r) {
        return r.string();
      },
      5(r) {
        return r.bytes();
      }
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/ws/protobuf_decode.js
var ServerMsg2, HelloErrorMsg, ResponseErrorMsg, ResponseOkMsg, ExecuteResp, BatchResp, FetchCursorResp, DescribeResp, GetAutocommitResp;
var init_protobuf_decode2 = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/ws/protobuf_decode.js"() {
    init_protobuf_decode();
    ServerMsg2 = {
      default() {
        return { type: "none" };
      },
      1(r) {
        return { type: "hello_ok" };
      },
      2(r) {
        return r.message(HelloErrorMsg);
      },
      3(r) {
        return r.message(ResponseOkMsg);
      },
      4(r) {
        return r.message(ResponseErrorMsg);
      }
    };
    HelloErrorMsg = {
      default() {
        return { type: "hello_error", error: Error3.default() };
      },
      1(r, msg) {
        msg.error = r.message(Error3);
      }
    };
    ResponseErrorMsg = {
      default() {
        return { type: "response_error", requestId: 0, error: Error3.default() };
      },
      1(r, msg) {
        msg.requestId = r.int32();
      },
      2(r, msg) {
        msg.error = r.message(Error3);
      }
    };
    ResponseOkMsg = {
      default() {
        return {
          type: "response_ok",
          requestId: 0,
          response: { type: "none" }
        };
      },
      1(r, msg) {
        msg.requestId = r.int32();
      },
      2(r, msg) {
        msg.response = { type: "open_stream" };
      },
      3(r, msg) {
        msg.response = { type: "close_stream" };
      },
      4(r, msg) {
        msg.response = r.message(ExecuteResp);
      },
      5(r, msg) {
        msg.response = r.message(BatchResp);
      },
      6(r, msg) {
        msg.response = { type: "open_cursor" };
      },
      7(r, msg) {
        msg.response = { type: "close_cursor" };
      },
      8(r, msg) {
        msg.response = r.message(FetchCursorResp);
      },
      9(r, msg) {
        msg.response = { type: "sequence" };
      },
      10(r, msg) {
        msg.response = r.message(DescribeResp);
      },
      11(r, msg) {
        msg.response = { type: "store_sql" };
      },
      12(r, msg) {
        msg.response = { type: "close_sql" };
      },
      13(r, msg) {
        msg.response = r.message(GetAutocommitResp);
      }
    };
    ExecuteResp = {
      default() {
        return { type: "execute", result: StmtResult2.default() };
      },
      1(r, msg) {
        msg.result = r.message(StmtResult2);
      }
    };
    BatchResp = {
      default() {
        return { type: "batch", result: BatchResult2.default() };
      },
      1(r, msg) {
        msg.result = r.message(BatchResult2);
      }
    };
    FetchCursorResp = {
      default() {
        return { type: "fetch_cursor", entries: [], done: false };
      },
      1(r, msg) {
        msg.entries.push(r.message(CursorEntry2));
      },
      2(r, msg) {
        msg.done = r.bool();
      }
    };
    DescribeResp = {
      default() {
        return { type: "describe", result: DescribeResult2.default() };
      },
      1(r, msg) {
        msg.result = r.message(DescribeResult2);
      }
    };
    GetAutocommitResp = {
      default() {
        return { type: "get_autocommit", isAutocommit: false };
      },
      1(r, msg) {
        msg.isAutocommit = r.bool();
      }
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/ws/client.js
var subprotocolsV2, subprotocolsV3, WsClient;
var init_client2 = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/ws/client.js"() {
    init_client();
    init_encoding();
    init_errors2();
    init_id_alloc();
    init_result();
    init_sql3();
    init_util3();
    init_stream2();
    init_json_encode2();
    init_protobuf_encode2();
    init_json_decode2();
    init_protobuf_decode2();
    subprotocolsV2 = /* @__PURE__ */ new Map([
      ["hrana2", { version: 2, encoding: "json" }],
      ["hrana1", { version: 1, encoding: "json" }]
    ]);
    subprotocolsV3 = /* @__PURE__ */ new Map([
      ["hrana3-protobuf", { version: 3, encoding: "protobuf" }],
      ["hrana3", { version: 3, encoding: "json" }],
      ["hrana2", { version: 2, encoding: "json" }],
      ["hrana1", { version: 1, encoding: "json" }]
    ]);
    WsClient = class extends Client {
      #socket;
      // List of callbacks that we queue until the socket transitions from the CONNECTING to the OPEN state.
      #openCallbacks;
      // Have we already transitioned from CONNECTING to OPEN and fired the callbacks in #openCallbacks?
      #opened;
      // Stores the error that caused us to close the client (and the socket). If we are not closed, this is
      // `undefined`.
      #closed;
      // Have we received a response to our "hello" from the server?
      #recvdHello;
      // Subprotocol negotiated with the server. It is only available after the socket transitions to the OPEN
      // state.
      #subprotocol;
      // Has the `getVersion()` function been called? This is only used to validate that the API is used
      // correctly.
      #getVersionCalled;
      // A map from request id to the responses that we expect to receive from the server.
      #responseMap;
      // An allocator of request ids.
      #requestIdAlloc;
      // An allocator of stream ids.
      /** @private */
      _streamIdAlloc;
      // An allocator of cursor ids.
      /** @private */
      _cursorIdAlloc;
      // An allocator of SQL text ids.
      #sqlIdAlloc;
      /** @private */
      constructor(socket, jwt) {
        super();
        this.#socket = socket;
        this.#openCallbacks = [];
        this.#opened = false;
        this.#closed = void 0;
        this.#recvdHello = false;
        this.#subprotocol = void 0;
        this.#getVersionCalled = false;
        this.#responseMap = /* @__PURE__ */ new Map();
        this.#requestIdAlloc = new IdAlloc();
        this._streamIdAlloc = new IdAlloc();
        this._cursorIdAlloc = new IdAlloc();
        this.#sqlIdAlloc = new IdAlloc();
        this.#socket.binaryType = "arraybuffer";
        this.#socket.addEventListener("open", () => this.#onSocketOpen());
        this.#socket.addEventListener("close", (event) => this.#onSocketClose(event));
        this.#socket.addEventListener("error", (event) => this.#onSocketError(event));
        this.#socket.addEventListener("message", (event) => this.#onSocketMessage(event));
        this.#send({ type: "hello", jwt });
      }
      // Send (or enqueue to send) a message to the server.
      #send(msg) {
        if (this.#closed !== void 0) {
          throw new InternalError("Trying to send a message on a closed client");
        }
        if (this.#opened) {
          this.#sendToSocket(msg);
        } else {
          const openCallback = () => this.#sendToSocket(msg);
          const errorCallback = () => void 0;
          this.#openCallbacks.push({ openCallback, errorCallback });
        }
      }
      // The socket transitioned from CONNECTING to OPEN
      #onSocketOpen() {
        const protocol = this.#socket.protocol;
        if (protocol === void 0) {
          this.#setClosed(new ClientError("The `WebSocket.protocol` property is undefined. This most likely means that the WebSocket implementation provided by the environment is broken. If you are using Miniflare 2, please update to Miniflare 3, which fixes this problem."));
          return;
        } else if (protocol === "") {
          this.#subprotocol = { version: 1, encoding: "json" };
        } else {
          this.#subprotocol = subprotocolsV3.get(protocol);
          if (this.#subprotocol === void 0) {
            this.#setClosed(new ProtoError(`Unrecognized WebSocket subprotocol: ${JSON.stringify(protocol)}`));
            return;
          }
        }
        for (const callbacks of this.#openCallbacks) {
          callbacks.openCallback();
        }
        this.#openCallbacks.length = 0;
        this.#opened = true;
      }
      #sendToSocket(msg) {
        const encoding = this.#subprotocol.encoding;
        if (encoding === "json") {
          const jsonMsg = writeJsonObject(msg, ClientMsg);
          this.#socket.send(jsonMsg);
        } else if (encoding === "protobuf") {
          const protobufMsg = writeProtobufMessage(msg, ClientMsg2);
          this.#socket.send(protobufMsg);
        } else {
          throw impossible(encoding, "Impossible encoding");
        }
      }
      /** Get the protocol version negotiated with the server, possibly waiting until the socket is open. */
      getVersion() {
        return new Promise((versionCallback, errorCallback) => {
          this.#getVersionCalled = true;
          if (this.#closed !== void 0) {
            errorCallback(this.#closed);
          } else if (!this.#opened) {
            const openCallback = () => versionCallback(this.#subprotocol.version);
            this.#openCallbacks.push({ openCallback, errorCallback });
          } else {
            versionCallback(this.#subprotocol.version);
          }
        });
      }
      // Make sure that the negotiated version is at least `minVersion`.
      /** @private */
      _ensureVersion(minVersion, feature) {
        if (this.#subprotocol === void 0 || !this.#getVersionCalled) {
          throw new ProtocolVersionError(`${feature} is supported only on protocol version ${minVersion} and higher, but the version supported by the WebSocket server is not yet known. Use Client.getVersion() to wait until the version is available.`);
        } else if (this.#subprotocol.version < minVersion) {
          throw new ProtocolVersionError(`${feature} is supported on protocol version ${minVersion} and higher, but the WebSocket server only supports version ${this.#subprotocol.version}`);
        }
      }
      // Send a request to the server and invoke a callback when we get the response.
      /** @private */
      _sendRequest(request, callbacks) {
        if (this.#closed !== void 0) {
          callbacks.errorCallback(new ClosedError("Client is closed", this.#closed));
          return;
        }
        const requestId = this.#requestIdAlloc.alloc();
        this.#responseMap.set(requestId, { ...callbacks, type: request.type });
        this.#send({ type: "request", requestId, request });
      }
      // The socket encountered an error.
      #onSocketError(event) {
        const eventMessage = event.message;
        const message = eventMessage ?? "WebSocket was closed due to an error";
        this.#setClosed(new WebSocketError(message));
      }
      // The socket was closed.
      #onSocketClose(event) {
        let message = `WebSocket was closed with code ${event.code}`;
        if (event.reason) {
          message += `: ${event.reason}`;
        }
        this.#setClosed(new WebSocketError(message));
      }
      // Close the client with the given error.
      #setClosed(error) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#closed = error;
        for (const callbacks of this.#openCallbacks) {
          callbacks.errorCallback(error);
        }
        this.#openCallbacks.length = 0;
        for (const [requestId, responseState] of this.#responseMap.entries()) {
          responseState.errorCallback(error);
          this.#requestIdAlloc.free(requestId);
        }
        this.#responseMap.clear();
        this.#socket.close();
      }
      // We received a message from the socket.
      #onSocketMessage(event) {
        if (this.#closed !== void 0) {
          return;
        }
        try {
          let msg;
          const encoding = this.#subprotocol.encoding;
          if (encoding === "json") {
            if (typeof event.data !== "string") {
              this.#socket.close(3003, "Only text messages are accepted with JSON encoding");
              this.#setClosed(new ProtoError("Received non-text message from server with JSON encoding"));
              return;
            }
            msg = readJsonObject(JSON.parse(event.data), ServerMsg);
          } else if (encoding === "protobuf") {
            if (!(event.data instanceof ArrayBuffer)) {
              this.#socket.close(3003, "Only binary messages are accepted with Protobuf encoding");
              this.#setClosed(new ProtoError("Received non-binary message from server with Protobuf encoding"));
              return;
            }
            msg = readProtobufMessage(new Uint8Array(event.data), ServerMsg2);
          } else {
            throw impossible(encoding, "Impossible encoding");
          }
          this.#handleMsg(msg);
        } catch (e) {
          this.#socket.close(3007, "Could not handle message");
          this.#setClosed(e);
        }
      }
      // Handle a message from the server.
      #handleMsg(msg) {
        if (msg.type === "none") {
          throw new ProtoError("Received an unrecognized ServerMsg");
        } else if (msg.type === "hello_ok" || msg.type === "hello_error") {
          if (this.#recvdHello) {
            throw new ProtoError("Received a duplicated hello response");
          }
          this.#recvdHello = true;
          if (msg.type === "hello_error") {
            throw errorFromProto(msg.error);
          }
          return;
        } else if (!this.#recvdHello) {
          throw new ProtoError("Received a non-hello message before a hello response");
        }
        if (msg.type === "response_ok") {
          const requestId = msg.requestId;
          const responseState = this.#responseMap.get(requestId);
          this.#responseMap.delete(requestId);
          if (responseState === void 0) {
            throw new ProtoError("Received unexpected OK response");
          }
          this.#requestIdAlloc.free(requestId);
          try {
            if (responseState.type !== msg.response.type) {
              console.dir({ responseState, msg });
              throw new ProtoError("Received unexpected type of response");
            }
            responseState.responseCallback(msg.response);
          } catch (e) {
            responseState.errorCallback(e);
            throw e;
          }
        } else if (msg.type === "response_error") {
          const requestId = msg.requestId;
          const responseState = this.#responseMap.get(requestId);
          this.#responseMap.delete(requestId);
          if (responseState === void 0) {
            throw new ProtoError("Received unexpected error response");
          }
          this.#requestIdAlloc.free(requestId);
          responseState.errorCallback(errorFromProto(msg.error));
        } else {
          throw impossible(msg, "Impossible ServerMsg type");
        }
      }
      /** Open a {@link WsStream}, a stream for executing SQL statements. */
      openStream() {
        return WsStream.open(this);
      }
      /** Cache a SQL text on the server. This requires protocol version 2 or higher. */
      storeSql(sql2) {
        this._ensureVersion(2, "storeSql()");
        const sqlId = this.#sqlIdAlloc.alloc();
        const sqlObj = new Sql(this, sqlId);
        const responseCallback = () => void 0;
        const errorCallback = (e) => sqlObj._setClosed(e);
        const request = { type: "store_sql", sqlId, sql: sql2 };
        this._sendRequest(request, { responseCallback, errorCallback });
        return sqlObj;
      }
      /** @private */
      _closeSql(sqlId) {
        if (this.#closed !== void 0) {
          return;
        }
        const responseCallback = () => this.#sqlIdAlloc.free(sqlId);
        const errorCallback = (e) => this.#setClosed(e);
        const request = { type: "close_sql", sqlId };
        this._sendRequest(request, { responseCallback, errorCallback });
      }
      /** Close the client and the WebSocket. */
      close() {
        this.#setClosed(new ClientError("Client was manually closed"));
      }
      /** True if the client is closed. */
      get closed() {
        return this.#closed !== void 0;
      }
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/queue_microtask.js
var _queueMicrotask;
var init_queue_microtask = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/queue_microtask.js"() {
    if (typeof queueMicrotask !== "undefined") {
      _queueMicrotask = queueMicrotask;
    } else {
      const resolved = Promise.resolve();
      _queueMicrotask = (callback) => {
        resolved.then(callback);
      };
    }
  }
});

// node_modules/@libsql/hrana-client/lib-esm/byte_queue.js
var ByteQueue;
var init_byte_queue = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/byte_queue.js"() {
    ByteQueue = class {
      #array;
      #shiftPos;
      #pushPos;
      constructor(initialCap) {
        this.#array = new Uint8Array(new ArrayBuffer(initialCap));
        this.#shiftPos = 0;
        this.#pushPos = 0;
      }
      get length() {
        return this.#pushPos - this.#shiftPos;
      }
      data() {
        return this.#array.slice(this.#shiftPos, this.#pushPos);
      }
      push(chunk) {
        this.#ensurePush(chunk.byteLength);
        this.#array.set(chunk, this.#pushPos);
        this.#pushPos += chunk.byteLength;
      }
      #ensurePush(pushLength) {
        if (this.#pushPos + pushLength <= this.#array.byteLength) {
          return;
        }
        const filledLength = this.#pushPos - this.#shiftPos;
        if (filledLength + pushLength <= this.#array.byteLength && 2 * this.#pushPos >= this.#array.byteLength) {
          this.#array.copyWithin(0, this.#shiftPos, this.#pushPos);
        } else {
          let newCap = this.#array.byteLength;
          do {
            newCap *= 2;
          } while (filledLength + pushLength > newCap);
          const newArray = new Uint8Array(new ArrayBuffer(newCap));
          newArray.set(this.#array.slice(this.#shiftPos, this.#pushPos), 0);
          this.#array = newArray;
        }
        this.#pushPos = filledLength;
        this.#shiftPos = 0;
      }
      shift(length) {
        this.#shiftPos += length;
      }
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/http/json_decode.js
function PipelineRespBody(obj) {
  const baton = stringOpt(obj["baton"]);
  const baseUrl = stringOpt(obj["base_url"]);
  const results = arrayObjectsMap(obj["results"], StreamResult);
  return { baton, baseUrl, results };
}
function StreamResult(obj) {
  const type = string(obj["type"]);
  if (type === "ok") {
    const response = StreamResponse(object(obj["response"]));
    return { type: "ok", response };
  } else if (type === "error") {
    const error = Error2(object(obj["error"]));
    return { type: "error", error };
  } else {
    throw new ProtoError("Unexpected type of StreamResult");
  }
}
function StreamResponse(obj) {
  const type = string(obj["type"]);
  if (type === "close") {
    return { type: "close" };
  } else if (type === "execute") {
    const result = StmtResult(object(obj["result"]));
    return { type: "execute", result };
  } else if (type === "batch") {
    const result = BatchResult(object(obj["result"]));
    return { type: "batch", result };
  } else if (type === "sequence") {
    return { type: "sequence" };
  } else if (type === "describe") {
    const result = DescribeResult(object(obj["result"]));
    return { type: "describe", result };
  } else if (type === "store_sql") {
    return { type: "store_sql" };
  } else if (type === "close_sql") {
    return { type: "close_sql" };
  } else if (type === "get_autocommit") {
    const isAutocommit = boolean(obj["is_autocommit"]);
    return { type: "get_autocommit", isAutocommit };
  } else {
    throw new ProtoError("Unexpected type of StreamResponse");
  }
}
function CursorRespBody(obj) {
  const baton = stringOpt(obj["baton"]);
  const baseUrl = stringOpt(obj["base_url"]);
  return { baton, baseUrl };
}
var init_json_decode3 = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/http/json_decode.js"() {
    init_errors2();
    init_decode();
    init_json_decode();
  }
});

// node_modules/@libsql/hrana-client/lib-esm/http/protobuf_decode.js
var PipelineRespBody2, StreamResult2, StreamResponse2, ExecuteStreamResp, BatchStreamResp, DescribeStreamResp, GetAutocommitStreamResp, CursorRespBody2;
var init_protobuf_decode3 = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/http/protobuf_decode.js"() {
    init_protobuf_decode();
    PipelineRespBody2 = {
      default() {
        return { baton: void 0, baseUrl: void 0, results: [] };
      },
      1(r, msg) {
        msg.baton = r.string();
      },
      2(r, msg) {
        msg.baseUrl = r.string();
      },
      3(r, msg) {
        msg.results.push(r.message(StreamResult2));
      }
    };
    StreamResult2 = {
      default() {
        return { type: "none" };
      },
      1(r) {
        return { type: "ok", response: r.message(StreamResponse2) };
      },
      2(r) {
        return { type: "error", error: r.message(Error3) };
      }
    };
    StreamResponse2 = {
      default() {
        return { type: "none" };
      },
      1(r) {
        return { type: "close" };
      },
      2(r) {
        return r.message(ExecuteStreamResp);
      },
      3(r) {
        return r.message(BatchStreamResp);
      },
      4(r) {
        return { type: "sequence" };
      },
      5(r) {
        return r.message(DescribeStreamResp);
      },
      6(r) {
        return { type: "store_sql" };
      },
      7(r) {
        return { type: "close_sql" };
      },
      8(r) {
        return r.message(GetAutocommitStreamResp);
      }
    };
    ExecuteStreamResp = {
      default() {
        return { type: "execute", result: StmtResult2.default() };
      },
      1(r, msg) {
        msg.result = r.message(StmtResult2);
      }
    };
    BatchStreamResp = {
      default() {
        return { type: "batch", result: BatchResult2.default() };
      },
      1(r, msg) {
        msg.result = r.message(BatchResult2);
      }
    };
    DescribeStreamResp = {
      default() {
        return { type: "describe", result: DescribeResult2.default() };
      },
      1(r, msg) {
        msg.result = r.message(DescribeResult2);
      }
    };
    GetAutocommitStreamResp = {
      default() {
        return { type: "get_autocommit", isAutocommit: false };
      },
      1(r, msg) {
        msg.isAutocommit = r.bool();
      }
    };
    CursorRespBody2 = {
      default() {
        return { baton: void 0, baseUrl: void 0 };
      },
      1(r, msg) {
        msg.baton = r.string();
      },
      2(r, msg) {
        msg.baseUrl = r.string();
      }
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/http/cursor.js
var HttpCursor;
var init_cursor3 = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/http/cursor.js"() {
    init_byte_queue();
    init_cursor();
    init_decode();
    init_decode2();
    init_errors2();
    init_util3();
    init_json_decode3();
    init_protobuf_decode3();
    init_json_decode();
    init_protobuf_decode();
    HttpCursor = class extends Cursor {
      #stream;
      #encoding;
      #reader;
      #queue;
      #closed;
      #done;
      /** @private */
      constructor(stream, encoding) {
        super();
        this.#stream = stream;
        this.#encoding = encoding;
        this.#reader = void 0;
        this.#queue = new ByteQueue(16 * 1024);
        this.#closed = void 0;
        this.#done = false;
      }
      async open(response) {
        if (response.body === null) {
          throw new ProtoError("No response body for cursor request");
        }
        this.#reader = response.body[Symbol.asyncIterator]();
        const respBody = await this.#nextItem(CursorRespBody, CursorRespBody2);
        if (respBody === void 0) {
          throw new ProtoError("Empty response to cursor request");
        }
        return respBody;
      }
      /** Fetch the next entry from the cursor. */
      next() {
        return this.#nextItem(CursorEntry, CursorEntry2);
      }
      /** Close the cursor. */
      close() {
        this._setClosed(new ClientError("Cursor was manually closed"));
      }
      /** @private */
      _setClosed(error) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#closed = error;
        this.#stream._cursorClosed(this);
        if (this.#reader !== void 0) {
          this.#reader.return();
        }
      }
      /** True if the cursor is closed. */
      get closed() {
        return this.#closed !== void 0;
      }
      async #nextItem(jsonFun, protobufDef) {
        for (; ; ) {
          if (this.#done) {
            return void 0;
          } else if (this.#closed !== void 0) {
            throw new ClosedError("Cursor is closed", this.#closed);
          }
          if (this.#encoding === "json") {
            const jsonData = this.#parseItemJson();
            if (jsonData !== void 0) {
              const jsonText = new TextDecoder().decode(jsonData);
              const jsonValue = JSON.parse(jsonText);
              return readJsonObject(jsonValue, jsonFun);
            }
          } else if (this.#encoding === "protobuf") {
            const protobufData = this.#parseItemProtobuf();
            if (protobufData !== void 0) {
              return readProtobufMessage(protobufData, protobufDef);
            }
          } else {
            throw impossible(this.#encoding, "Impossible encoding");
          }
          if (this.#reader === void 0) {
            throw new InternalError("Attempted to read from HTTP cursor before it was opened");
          }
          const { value, done } = await this.#reader.next();
          if (done && this.#queue.length === 0) {
            this.#done = true;
          } else if (done) {
            throw new ProtoError("Unexpected end of cursor stream");
          } else {
            this.#queue.push(value);
          }
        }
      }
      #parseItemJson() {
        const data = this.#queue.data();
        const newlineByte = 10;
        const newlinePos = data.indexOf(newlineByte);
        if (newlinePos < 0) {
          return void 0;
        }
        const jsonData = data.slice(0, newlinePos);
        this.#queue.shift(newlinePos + 1);
        return jsonData;
      }
      #parseItemProtobuf() {
        const data = this.#queue.data();
        let varintValue = 0;
        let varintLength = 0;
        for (; ; ) {
          if (varintLength >= data.byteLength) {
            return void 0;
          }
          const byte = data[varintLength];
          varintValue |= (byte & 127) << 7 * varintLength;
          varintLength += 1;
          if (!(byte & 128)) {
            break;
          }
        }
        if (data.byteLength < varintLength + varintValue) {
          return void 0;
        }
        const protobufData = data.slice(varintLength, varintLength + varintValue);
        this.#queue.shift(varintLength + varintValue);
        return protobufData;
      }
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/http/json_encode.js
function PipelineReqBody(w, msg) {
  if (msg.baton !== void 0) {
    w.string("baton", msg.baton);
  }
  w.arrayObjects("requests", msg.requests, StreamRequest);
}
function StreamRequest(w, msg) {
  w.stringRaw("type", msg.type);
  if (msg.type === "close") {
  } else if (msg.type === "execute") {
    w.object("stmt", msg.stmt, Stmt2);
  } else if (msg.type === "batch") {
    w.object("batch", msg.batch, Batch2);
  } else if (msg.type === "sequence") {
    if (msg.sql !== void 0) {
      w.string("sql", msg.sql);
    }
    if (msg.sqlId !== void 0) {
      w.number("sql_id", msg.sqlId);
    }
  } else if (msg.type === "describe") {
    if (msg.sql !== void 0) {
      w.string("sql", msg.sql);
    }
    if (msg.sqlId !== void 0) {
      w.number("sql_id", msg.sqlId);
    }
  } else if (msg.type === "store_sql") {
    w.number("sql_id", msg.sqlId);
    w.string("sql", msg.sql);
  } else if (msg.type === "close_sql") {
    w.number("sql_id", msg.sqlId);
  } else if (msg.type === "get_autocommit") {
  } else {
    throw impossible(msg, "Impossible type of StreamRequest");
  }
}
function CursorReqBody(w, msg) {
  if (msg.baton !== void 0) {
    w.string("baton", msg.baton);
  }
  w.object("batch", msg.batch, Batch2);
}
var init_json_encode3 = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/http/json_encode.js"() {
    init_json_encode();
    init_util3();
  }
});

// node_modules/@libsql/hrana-client/lib-esm/http/protobuf_encode.js
function PipelineReqBody2(w, msg) {
  if (msg.baton !== void 0) {
    w.string(1, msg.baton);
  }
  for (const req of msg.requests) {
    w.message(2, req, StreamRequest2);
  }
}
function StreamRequest2(w, msg) {
  if (msg.type === "close") {
    w.message(1, msg, CloseStreamReq2);
  } else if (msg.type === "execute") {
    w.message(2, msg, ExecuteStreamReq);
  } else if (msg.type === "batch") {
    w.message(3, msg, BatchStreamReq);
  } else if (msg.type === "sequence") {
    w.message(4, msg, SequenceStreamReq);
  } else if (msg.type === "describe") {
    w.message(5, msg, DescribeStreamReq);
  } else if (msg.type === "store_sql") {
    w.message(6, msg, StoreSqlStreamReq);
  } else if (msg.type === "close_sql") {
    w.message(7, msg, CloseSqlStreamReq);
  } else if (msg.type === "get_autocommit") {
    w.message(8, msg, GetAutocommitStreamReq);
  } else {
    throw impossible(msg, "Impossible type of StreamRequest");
  }
}
function CloseStreamReq2(_w, _msg) {
}
function ExecuteStreamReq(w, msg) {
  w.message(1, msg.stmt, Stmt3);
}
function BatchStreamReq(w, msg) {
  w.message(1, msg.batch, Batch3);
}
function SequenceStreamReq(w, msg) {
  if (msg.sql !== void 0) {
    w.string(1, msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.int32(2, msg.sqlId);
  }
}
function DescribeStreamReq(w, msg) {
  if (msg.sql !== void 0) {
    w.string(1, msg.sql);
  }
  if (msg.sqlId !== void 0) {
    w.int32(2, msg.sqlId);
  }
}
function StoreSqlStreamReq(w, msg) {
  w.int32(1, msg.sqlId);
  w.string(2, msg.sql);
}
function CloseSqlStreamReq(w, msg) {
  w.int32(1, msg.sqlId);
}
function GetAutocommitStreamReq(_w, _msg) {
}
function CursorReqBody2(w, msg) {
  if (msg.baton !== void 0) {
    w.string(1, msg.baton);
  }
  w.message(2, msg.batch, Batch3);
}
var init_protobuf_encode3 = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/http/protobuf_encode.js"() {
    init_protobuf_encode();
    init_util3();
  }
});

// node_modules/@libsql/hrana-client/lib-esm/http/stream.js
function handlePipelineResponse(pipeline, respBody) {
  if (respBody.results.length !== pipeline.length) {
    throw new ProtoError("Server returned unexpected number of pipeline results");
  }
  for (let i = 0; i < pipeline.length; ++i) {
    const result = respBody.results[i];
    const entry = pipeline[i];
    if (result.type === "ok") {
      if (result.response.type !== entry.request.type) {
        throw new ProtoError("Received unexpected type of response");
      }
      entry.responseCallback(result.response);
    } else if (result.type === "error") {
      entry.errorCallback(errorFromProto(result.error));
    } else if (result.type === "none") {
      throw new ProtoError("Received unrecognized type of StreamResult");
    } else {
      throw impossible(result, "Received impossible type of StreamResult");
    }
  }
}
async function decodePipelineResponse(resp, encoding) {
  if (encoding === "json") {
    const respJson = await resp.json();
    return readJsonObject(respJson, PipelineRespBody);
  }
  if (encoding === "protobuf") {
    const respData = await resp.arrayBuffer();
    return readProtobufMessage(new Uint8Array(respData), PipelineRespBody2);
  }
  await resp.body?.cancel();
  throw impossible(encoding, "Impossible encoding");
}
async function errorFromResponse(resp) {
  const respType = resp.headers.get("content-type") ?? "text/plain";
  let message = `Server returned HTTP status ${resp.status}`;
  if (respType === "application/json") {
    const respBody = await resp.json();
    if ("message" in respBody) {
      return errorFromProto(respBody);
    }
    return new HttpServerError(message, resp.status);
  }
  if (respType === "text/plain") {
    const respBody = (await resp.text()).trim();
    if (respBody !== "") {
      message += `: ${respBody}`;
    }
    return new HttpServerError(message, resp.status);
  }
  await resp.body?.cancel();
  return new HttpServerError(message, resp.status);
}
var HttpStream;
var init_stream3 = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/http/stream.js"() {
    init_errors2();
    init_encoding();
    init_id_alloc();
    init_queue();
    init_queue_microtask();
    init_result();
    init_sql3();
    init_stream();
    init_util3();
    init_cursor3();
    init_json_encode3();
    init_protobuf_encode3();
    init_json_encode3();
    init_protobuf_encode3();
    init_json_decode3();
    init_protobuf_decode3();
    HttpStream = class extends Stream {
      #client;
      #baseUrl;
      #jwt;
      #fetch;
      #remoteEncryptionKey;
      #baton;
      #queue;
      #flushing;
      #cursor;
      #closing;
      #closeQueued;
      #closed;
      #sqlIdAlloc;
      /** @private */
      constructor(client, baseUrl, jwt, customFetch, remoteEncryptionKey) {
        super(client.intMode);
        this.#client = client;
        this.#baseUrl = baseUrl.toString();
        this.#jwt = jwt;
        this.#fetch = customFetch;
        this.#remoteEncryptionKey = remoteEncryptionKey;
        this.#baton = void 0;
        this.#queue = new Queue();
        this.#flushing = false;
        this.#closing = false;
        this.#closeQueued = false;
        this.#closed = void 0;
        this.#sqlIdAlloc = new IdAlloc();
      }
      /** Get the {@link HttpClient} object that this stream belongs to. */
      client() {
        return this.#client;
      }
      /** @private */
      _sqlOwner() {
        return this;
      }
      /** Cache a SQL text on the server. */
      storeSql(sql2) {
        const sqlId = this.#sqlIdAlloc.alloc();
        this.#sendStreamRequest({ type: "store_sql", sqlId, sql: sql2 }).then(() => void 0, (error) => this._setClosed(error));
        return new Sql(this, sqlId);
      }
      /** @private */
      _closeSql(sqlId) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#sendStreamRequest({ type: "close_sql", sqlId }).then(() => this.#sqlIdAlloc.free(sqlId), (error) => this._setClosed(error));
      }
      /** @private */
      _execute(stmt) {
        return this.#sendStreamRequest({ type: "execute", stmt }).then((response) => {
          return response.result;
        });
      }
      /** @private */
      _batch(batch) {
        return this.#sendStreamRequest({ type: "batch", batch }).then((response) => {
          return response.result;
        });
      }
      /** @private */
      _describe(protoSql) {
        return this.#sendStreamRequest({
          type: "describe",
          sql: protoSql.sql,
          sqlId: protoSql.sqlId
        }).then((response) => {
          return response.result;
        });
      }
      /** @private */
      _sequence(protoSql) {
        return this.#sendStreamRequest({
          type: "sequence",
          sql: protoSql.sql,
          sqlId: protoSql.sqlId
        }).then((_response) => {
          return void 0;
        });
      }
      /** Check whether the SQL connection underlying this stream is in autocommit state (i.e., outside of an
       * explicit transaction). This requires protocol version 3 or higher.
       */
      getAutocommit() {
        this.#client._ensureVersion(3, "getAutocommit()");
        return this.#sendStreamRequest({
          type: "get_autocommit"
        }).then((response) => {
          return response.isAutocommit;
        });
      }
      #sendStreamRequest(request) {
        return new Promise((responseCallback, errorCallback) => {
          this.#pushToQueue({ type: "pipeline", request, responseCallback, errorCallback });
        });
      }
      /** @private */
      _openCursor(batch) {
        return new Promise((cursorCallback, errorCallback) => {
          this.#pushToQueue({ type: "cursor", batch, cursorCallback, errorCallback });
        });
      }
      /** @private */
      _cursorClosed(cursor) {
        if (cursor !== this.#cursor) {
          throw new InternalError("Cursor was closed, but it was not associated with the stream");
        }
        this.#cursor = void 0;
        _queueMicrotask(() => this.#flushQueue());
      }
      /** Immediately close the stream. */
      close() {
        this._setClosed(new ClientError("Stream was manually closed"));
      }
      /** Gracefully close the stream. */
      closeGracefully() {
        this.#closing = true;
        _queueMicrotask(() => this.#flushQueue());
      }
      /** True if the stream is closed. */
      get closed() {
        return this.#closed !== void 0 || this.#closing;
      }
      /** @private */
      _setClosed(error) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#closed = error;
        if (this.#cursor !== void 0) {
          this.#cursor._setClosed(error);
        }
        this.#client._streamClosed(this);
        for (; ; ) {
          const entry = this.#queue.shift();
          if (entry !== void 0) {
            entry.errorCallback(error);
          } else {
            break;
          }
        }
        if ((this.#baton !== void 0 || this.#flushing) && !this.#closeQueued) {
          this.#queue.push({
            type: "pipeline",
            request: { type: "close" },
            responseCallback: () => void 0,
            errorCallback: () => void 0
          });
          this.#closeQueued = true;
          _queueMicrotask(() => this.#flushQueue());
        }
      }
      #pushToQueue(entry) {
        if (this.#closed !== void 0) {
          throw new ClosedError("Stream is closed", this.#closed);
        } else if (this.#closing) {
          throw new ClosedError("Stream is closing", void 0);
        } else {
          this.#queue.push(entry);
          _queueMicrotask(() => this.#flushQueue());
        }
      }
      #flushQueue() {
        if (this.#flushing || this.#cursor !== void 0) {
          return;
        }
        if (this.#closing && this.#queue.length === 0) {
          this._setClosed(new ClientError("Stream was gracefully closed"));
          return;
        }
        const endpoint = this.#client._endpoint;
        if (endpoint === void 0) {
          this.#client._endpointPromise.then(() => this.#flushQueue(), (error) => this._setClosed(error));
          return;
        }
        const firstEntry = this.#queue.shift();
        if (firstEntry === void 0) {
          return;
        } else if (firstEntry.type === "pipeline") {
          const pipeline = [firstEntry];
          for (; ; ) {
            const entry = this.#queue.first();
            if (entry !== void 0 && entry.type === "pipeline") {
              pipeline.push(entry);
              this.#queue.shift();
            } else if (entry === void 0 && this.#closing && !this.#closeQueued) {
              pipeline.push({
                type: "pipeline",
                request: { type: "close" },
                responseCallback: () => void 0,
                errorCallback: () => void 0
              });
              this.#closeQueued = true;
              break;
            } else {
              break;
            }
          }
          this.#flushPipeline(endpoint, pipeline);
        } else if (firstEntry.type === "cursor") {
          this.#flushCursor(endpoint, firstEntry);
        } else {
          throw impossible(firstEntry, "Impossible type of QueueEntry");
        }
      }
      #flushPipeline(endpoint, pipeline) {
        this.#flush(() => this.#createPipelineRequest(pipeline, endpoint), (resp) => decodePipelineResponse(resp, endpoint.encoding), (respBody) => respBody.baton, (respBody) => respBody.baseUrl, (respBody) => handlePipelineResponse(pipeline, respBody), (error) => pipeline.forEach((entry) => entry.errorCallback(error)));
      }
      #flushCursor(endpoint, entry) {
        const cursor = new HttpCursor(this, endpoint.encoding);
        this.#cursor = cursor;
        this.#flush(() => this.#createCursorRequest(entry, endpoint), (resp) => cursor.open(resp), (respBody) => respBody.baton, (respBody) => respBody.baseUrl, (_respBody) => entry.cursorCallback(cursor), (error) => entry.errorCallback(error));
      }
      #flush(createRequest, decodeResponse, getBaton, getBaseUrl, handleResponse, handleError) {
        let promise;
        try {
          const request = createRequest();
          const fetch = this.#fetch;
          promise = fetch(request);
        } catch (error) {
          promise = Promise.reject(error);
        }
        this.#flushing = true;
        promise.then((resp) => {
          if (!resp.ok) {
            return errorFromResponse(resp).then((error) => {
              throw error;
            });
          }
          return decodeResponse(resp);
        }).then((r) => {
          this.#baton = getBaton(r);
          this.#baseUrl = getBaseUrl(r) ?? this.#baseUrl;
          handleResponse(r);
        }).catch((error) => {
          this._setClosed(error);
          handleError(error);
        }).finally(() => {
          this.#flushing = false;
          this.#flushQueue();
        });
      }
      #createPipelineRequest(pipeline, endpoint) {
        return this.#createRequest(new URL(endpoint.pipelinePath, this.#baseUrl), {
          baton: this.#baton,
          requests: pipeline.map((entry) => entry.request)
        }, endpoint.encoding, PipelineReqBody, PipelineReqBody2);
      }
      #createCursorRequest(entry, endpoint) {
        if (endpoint.cursorPath === void 0) {
          throw new ProtocolVersionError(`Cursors are supported only on protocol version 3 and higher, but the HTTP server only supports version ${endpoint.version}.`);
        }
        return this.#createRequest(new URL(endpoint.cursorPath, this.#baseUrl), {
          baton: this.#baton,
          batch: entry.batch
        }, endpoint.encoding, CursorReqBody, CursorReqBody2);
      }
      #createRequest(url, reqBody, encoding, jsonFun, protobufFun) {
        let bodyData;
        let contentType;
        if (encoding === "json") {
          bodyData = writeJsonObject(reqBody, jsonFun);
          contentType = "application/json";
        } else if (encoding === "protobuf") {
          bodyData = writeProtobufMessage(reqBody, protobufFun);
          contentType = "application/x-protobuf";
        } else {
          throw impossible(encoding, "Impossible encoding");
        }
        const headers = new Headers();
        headers.set("content-type", contentType);
        if (this.#jwt !== void 0) {
          headers.set("authorization", `Bearer ${this.#jwt}`);
        }
        if (this.#remoteEncryptionKey !== void 0) {
          headers.set("x-turso-encryption-key", this.#remoteEncryptionKey);
        }
        return new Request(url.toString(), { method: "POST", headers, body: bodyData });
      }
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/http/client.js
async function findEndpoint(customFetch, clientUrl) {
  const fetch = customFetch;
  for (const endpoint of checkEndpoints) {
    const url = new URL(endpoint.versionPath, clientUrl);
    const request = new Request(url.toString(), { method: "GET" });
    const response = await fetch(request);
    await response.arrayBuffer();
    if (response.ok) {
      return endpoint;
    }
  }
  return fallbackEndpoint;
}
var checkEndpoints, fallbackEndpoint, HttpClient;
var init_client3 = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/http/client.js"() {
    init_client();
    init_errors2();
    init_stream3();
    checkEndpoints = [
      {
        versionPath: "v3-protobuf",
        pipelinePath: "v3-protobuf/pipeline",
        cursorPath: "v3-protobuf/cursor",
        version: 3,
        encoding: "protobuf"
      }
      /*
      {
          versionPath: "v3",
          pipelinePath: "v3/pipeline",
          cursorPath: "v3/cursor",
          version: 3,
          encoding: "json",
      },
      */
    ];
    fallbackEndpoint = {
      versionPath: "v2",
      pipelinePath: "v2/pipeline",
      cursorPath: void 0,
      version: 2,
      encoding: "json"
    };
    HttpClient = class extends Client {
      #url;
      #jwt;
      #fetch;
      #remoteEncryptionKey;
      #closed;
      #streams;
      /** @private */
      _endpointPromise;
      /** @private */
      _endpoint;
      /** @private */
      constructor(url, jwt, customFetch, remoteEncryptionKey, protocolVersion = 2) {
        super();
        this.#url = url;
        this.#jwt = jwt;
        this.#fetch = customFetch ?? globalThis.fetch;
        this.#remoteEncryptionKey = remoteEncryptionKey;
        this.#closed = void 0;
        this.#streams = /* @__PURE__ */ new Set();
        if (protocolVersion == 3) {
          this._endpointPromise = findEndpoint(this.#fetch, this.#url);
          this._endpointPromise.then((endpoint) => this._endpoint = endpoint, (error) => this.#setClosed(error));
        } else {
          this._endpointPromise = Promise.resolve(fallbackEndpoint);
          this._endpointPromise.then((endpoint) => this._endpoint = endpoint, (error) => this.#setClosed(error));
        }
      }
      /** Get the protocol version supported by the server. */
      async getVersion() {
        if (this._endpoint !== void 0) {
          return this._endpoint.version;
        }
        return (await this._endpointPromise).version;
      }
      // Make sure that the negotiated version is at least `minVersion`.
      /** @private */
      _ensureVersion(minVersion, feature) {
        if (minVersion <= fallbackEndpoint.version) {
          return;
        } else if (this._endpoint === void 0) {
          throw new ProtocolVersionError(`${feature} is supported only on protocol version ${minVersion} and higher, but the version supported by the HTTP server is not yet known. Use Client.getVersion() to wait until the version is available.`);
        } else if (this._endpoint.version < minVersion) {
          throw new ProtocolVersionError(`${feature} is supported only on protocol version ${minVersion} and higher, but the HTTP server only supports version ${this._endpoint.version}.`);
        }
      }
      /** Open a {@link HttpStream}, a stream for executing SQL statements. */
      openStream() {
        if (this.#closed !== void 0) {
          throw new ClosedError("Client is closed", this.#closed);
        }
        const stream = new HttpStream(this, this.#url, this.#jwt, this.#fetch, this.#remoteEncryptionKey);
        this.#streams.add(stream);
        return stream;
      }
      /** @private */
      _streamClosed(stream) {
        this.#streams.delete(stream);
      }
      /** Close the client and all its streams. */
      close() {
        this.#setClosed(new ClientError("Client was manually closed"));
      }
      /** True if the client is closed. */
      get closed() {
        return this.#closed !== void 0;
      }
      #setClosed(error) {
        if (this.#closed !== void 0) {
          return;
        }
        this.#closed = error;
        for (const stream of Array.from(this.#streams)) {
          stream._setClosed(new ClosedError("Client was closed", error));
        }
      }
    };
  }
});

// node_modules/@libsql/hrana-client/lib-esm/libsql_url.js
var init_libsql_url = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/libsql_url.js"() {
    init_errors2();
  }
});

// node_modules/@libsql/hrana-client/lib-esm/index.js
function openWs(url, jwt, protocolVersion = 2) {
  if (typeof import_websocket.default === "undefined") {
    throw new WebSocketUnsupportedError("WebSockets are not supported in this environment");
  }
  var subprotocols = void 0;
  if (protocolVersion == 3) {
    subprotocols = Array.from(subprotocolsV3.keys());
  } else {
    subprotocols = Array.from(subprotocolsV2.keys());
  }
  const socket = new import_websocket.default(url, subprotocols);
  return new WsClient(socket, jwt);
}
function openHttp(url, jwt, customFetch, remoteEncryptionKey, protocolVersion = 2) {
  return new HttpClient(url instanceof URL ? url : new URL(url), jwt, customFetch, remoteEncryptionKey, protocolVersion);
}
var init_lib_esm = __esm({
  "node_modules/@libsql/hrana-client/lib-esm/index.js"() {
    init_node();
    init_client2();
    init_errors2();
    init_client3();
    init_client2();
    init_node();
    init_client();
    init_errors2();
    init_batch();
    init_libsql_url();
    init_sql3();
    init_stmt();
    init_stream();
    init_client3();
    init_stream3();
    init_client2();
    init_stream2();
  }
});

// node_modules/@libsql/client/lib-esm/hrana.js
async function executeHranaBatch(mode, version3, batch, hranaStmts, disableForeignKeys = false) {
  if (disableForeignKeys) {
    batch.step().run("PRAGMA foreign_keys=off");
  }
  const beginStep = batch.step();
  const beginPromise = beginStep.run(transactionModeToBegin(mode));
  let lastStep = beginStep;
  const stmtPromises = hranaStmts.map((hranaStmt) => {
    const stmtStep = batch.step().condition(BatchCond.ok(lastStep));
    if (version3 >= 3) {
      stmtStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
    }
    const stmtPromise = stmtStep.query(hranaStmt);
    lastStep = stmtStep;
    return stmtPromise;
  });
  const commitStep = batch.step().condition(BatchCond.ok(lastStep));
  if (version3 >= 3) {
    commitStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
  }
  const commitPromise = commitStep.run("COMMIT");
  const rollbackStep = batch.step().condition(BatchCond.not(BatchCond.ok(commitStep)));
  rollbackStep.run("ROLLBACK").catch((_) => void 0);
  if (disableForeignKeys) {
    batch.step().run("PRAGMA foreign_keys=on");
  }
  await batch.execute();
  const resultSets = [];
  await beginPromise;
  for (let i = 0; i < stmtPromises.length; i++) {
    try {
      const hranaRows = await stmtPromises[i];
      if (hranaRows === void 0) {
        throw new LibsqlBatchError("Statement in a batch was not executed, probably because the transaction has been rolled back", i, "TRANSACTION_CLOSED");
      }
      resultSets.push(resultSetFromHrana(hranaRows));
    } catch (e) {
      if (e instanceof LibsqlBatchError) {
        throw e;
      }
      const mappedError = mapHranaError(e);
      if (mappedError instanceof LibsqlError) {
        throw new LibsqlBatchError(mappedError.message, i, mappedError.code, mappedError.extendedCode, mappedError.rawCode, mappedError.cause instanceof Error ? mappedError.cause : void 0);
      }
      throw mappedError;
    }
  }
  await commitPromise;
  return resultSets;
}
function stmtToHrana(stmt) {
  let sql2;
  let args2;
  if (Array.isArray(stmt)) {
    [sql2, args2] = stmt;
  } else if (typeof stmt === "string") {
    sql2 = stmt;
  } else {
    sql2 = stmt.sql;
    args2 = stmt.args;
  }
  const hranaStmt = new Stmt(sql2);
  if (args2) {
    if (Array.isArray(args2)) {
      hranaStmt.bindIndexes(args2);
    } else {
      for (const [key, value] of Object.entries(args2)) {
        hranaStmt.bindName(key, value);
      }
    }
  }
  return hranaStmt;
}
function resultSetFromHrana(hranaRows) {
  const columns = hranaRows.columnNames.map((c) => c ?? "");
  const columnTypes = hranaRows.columnDecltypes.map((c) => c ?? "");
  const rows = hranaRows.rows;
  const rowsAffected = hranaRows.affectedRowCount;
  const lastInsertRowid = hranaRows.lastInsertRowid !== void 0 ? hranaRows.lastInsertRowid : void 0;
  return new ResultSetImpl(columns, columnTypes, rows, rowsAffected, lastInsertRowid);
}
function mapHranaError(e) {
  if (e instanceof ClientError) {
    const code = mapHranaErrorCode(e);
    return new LibsqlError(e.message, code, void 0, void 0, e);
  }
  return e;
}
function mapHranaErrorCode(e) {
  if (e instanceof ResponseError && e.code !== void 0) {
    return e.code;
  } else if (e instanceof ProtoError) {
    return "HRANA_PROTO_ERROR";
  } else if (e instanceof ClosedError) {
    return e.cause instanceof ClientError ? mapHranaErrorCode(e.cause) : "HRANA_CLOSED_ERROR";
  } else if (e instanceof WebSocketError) {
    return "HRANA_WEBSOCKET_ERROR";
  } else if (e instanceof HttpServerError) {
    return "SERVER_ERROR";
  } else if (e instanceof ProtocolVersionError) {
    return "PROTOCOL_VERSION_ERROR";
  } else if (e instanceof InternalError) {
    return "INTERNAL_ERROR";
  } else {
    return "UNKNOWN";
  }
}
var HranaTransaction;
var init_hrana = __esm({
  "node_modules/@libsql/client/lib-esm/hrana.js"() {
    init_lib_esm();
    init_api();
    init_util();
    HranaTransaction = class {
      #mode;
      #version;
      // Promise that is resolved when the BEGIN statement completes, or `undefined` if we haven't executed the
      // BEGIN statement yet.
      #started;
      /** @private */
      constructor(mode, version3) {
        this.#mode = mode;
        this.#version = version3;
        this.#started = void 0;
      }
      execute(stmt) {
        return this.batch([stmt]).then((results) => results[0]);
      }
      async batch(stmts) {
        const stream = this._getStream();
        if (stream.closed) {
          throw new LibsqlError("Cannot execute statements because the transaction is closed", "TRANSACTION_CLOSED");
        }
        try {
          const hranaStmts = stmts.map(stmtToHrana);
          let rowsPromises;
          if (this.#started === void 0) {
            this._getSqlCache().apply(hranaStmts);
            const batch = stream.batch(this.#version >= 3);
            const beginStep = batch.step();
            const beginPromise = beginStep.run(transactionModeToBegin(this.#mode));
            let lastStep = beginStep;
            rowsPromises = hranaStmts.map((hranaStmt) => {
              const stmtStep = batch.step().condition(BatchCond.ok(lastStep));
              if (this.#version >= 3) {
                stmtStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
              }
              const rowsPromise = stmtStep.query(hranaStmt);
              rowsPromise.catch(() => void 0);
              lastStep = stmtStep;
              return rowsPromise;
            });
            this.#started = batch.execute().then(() => beginPromise).then(() => void 0);
            try {
              await this.#started;
            } catch (e) {
              this.close();
              throw e;
            }
          } else {
            if (this.#version < 3) {
              await this.#started;
            } else {
            }
            this._getSqlCache().apply(hranaStmts);
            const batch = stream.batch(this.#version >= 3);
            let lastStep = void 0;
            rowsPromises = hranaStmts.map((hranaStmt) => {
              const stmtStep = batch.step();
              if (lastStep !== void 0) {
                stmtStep.condition(BatchCond.ok(lastStep));
              }
              if (this.#version >= 3) {
                stmtStep.condition(BatchCond.not(BatchCond.isAutocommit(batch)));
              }
              const rowsPromise = stmtStep.query(hranaStmt);
              rowsPromise.catch(() => void 0);
              lastStep = stmtStep;
              return rowsPromise;
            });
            await batch.execute();
          }
          const resultSets = [];
          for (let i = 0; i < rowsPromises.length; i++) {
            try {
              const rows = await rowsPromises[i];
              if (rows === void 0) {
                throw new LibsqlBatchError("Statement in a transaction was not executed, probably because the transaction has been rolled back", i, "TRANSACTION_CLOSED");
              }
              resultSets.push(resultSetFromHrana(rows));
            } catch (e) {
              if (e instanceof LibsqlBatchError) {
                throw e;
              }
              const mappedError = mapHranaError(e);
              if (mappedError instanceof LibsqlError) {
                throw new LibsqlBatchError(mappedError.message, i, mappedError.code, mappedError.extendedCode, mappedError.rawCode, mappedError.cause instanceof Error ? mappedError.cause : void 0);
              }
              throw mappedError;
            }
          }
          return resultSets;
        } catch (e) {
          throw mapHranaError(e);
        }
      }
      async executeMultiple(sql2) {
        const stream = this._getStream();
        if (stream.closed) {
          throw new LibsqlError("Cannot execute statements because the transaction is closed", "TRANSACTION_CLOSED");
        }
        try {
          if (this.#started === void 0) {
            this.#started = stream.run(transactionModeToBegin(this.#mode)).then(() => void 0);
            try {
              await this.#started;
            } catch (e) {
              this.close();
              throw e;
            }
          } else {
            await this.#started;
          }
          await stream.sequence(sql2);
        } catch (e) {
          throw mapHranaError(e);
        }
      }
      async rollback() {
        try {
          const stream = this._getStream();
          if (stream.closed) {
            return;
          }
          if (this.#started !== void 0) {
          } else {
            return;
          }
          const promise = stream.run("ROLLBACK").catch((e) => {
            throw mapHranaError(e);
          });
          stream.closeGracefully();
          await promise;
        } catch (e) {
          throw mapHranaError(e);
        } finally {
          this.close();
        }
      }
      async commit() {
        try {
          const stream = this._getStream();
          if (stream.closed) {
            throw new LibsqlError("Cannot commit the transaction because it is already closed", "TRANSACTION_CLOSED");
          }
          if (this.#started !== void 0) {
            await this.#started;
          } else {
            return;
          }
          const promise = stream.run("COMMIT").catch((e) => {
            throw mapHranaError(e);
          });
          stream.closeGracefully();
          await promise;
        } catch (e) {
          throw mapHranaError(e);
        } finally {
          this.close();
        }
      }
    };
  }
});

// node_modules/@libsql/client/lib-esm/sql_cache.js
var SqlCache, Lru;
var init_sql_cache = __esm({
  "node_modules/@libsql/client/lib-esm/sql_cache.js"() {
    SqlCache = class {
      #owner;
      #sqls;
      capacity;
      constructor(owner, capacity) {
        this.#owner = owner;
        this.#sqls = new Lru();
        this.capacity = capacity;
      }
      // Replaces SQL strings with cached `hrana.Sql` objects in the statements in `hranaStmts`. After this
      // function returns, we guarantee that all `hranaStmts` refer to valid (not closed) `hrana.Sql` objects,
      // but _we may invalidate any other `hrana.Sql` objects_ (by closing them, thus removing them from the
      // server).
      //
      // In practice, this means that after calling this function, you can use the statements only up to the
      // first `await`, because concurrent code may also use the cache and invalidate those statements.
      apply(hranaStmts) {
        if (this.capacity <= 0) {
          return;
        }
        const usedSqlObjs = /* @__PURE__ */ new Set();
        for (const hranaStmt of hranaStmts) {
          if (typeof hranaStmt.sql !== "string") {
            continue;
          }
          const sqlText = hranaStmt.sql;
          if (sqlText.length >= 5e3) {
            continue;
          }
          let sqlObj = this.#sqls.get(sqlText);
          if (sqlObj === void 0) {
            while (this.#sqls.size + 1 > this.capacity) {
              const [evictSqlText, evictSqlObj] = this.#sqls.peekLru();
              if (usedSqlObjs.has(evictSqlObj)) {
                break;
              }
              evictSqlObj.close();
              this.#sqls.delete(evictSqlText);
            }
            if (this.#sqls.size + 1 <= this.capacity) {
              sqlObj = this.#owner.storeSql(sqlText);
              this.#sqls.set(sqlText, sqlObj);
            }
          }
          if (sqlObj !== void 0) {
            hranaStmt.sql = sqlObj;
            usedSqlObjs.add(sqlObj);
          }
        }
      }
    };
    Lru = class {
      // This maps keys to the cache values. The entries are ordered by their last use (entires that were used
      // most recently are at the end).
      #cache;
      constructor() {
        this.#cache = /* @__PURE__ */ new Map();
      }
      get(key) {
        const value = this.#cache.get(key);
        if (value !== void 0) {
          this.#cache.delete(key);
          this.#cache.set(key, value);
        }
        return value;
      }
      set(key, value) {
        this.#cache.set(key, value);
      }
      peekLru() {
        for (const entry of this.#cache.entries()) {
          return entry;
        }
        return void 0;
      }
      delete(key) {
        this.#cache.delete(key);
      }
      get size() {
        return this.#cache.size;
      }
    };
  }
});

// node_modules/promise-limit/index.js
var require_promise_limit = __commonJS({
  "node_modules/promise-limit/index.js"(exports2, module2) {
    function limiter(count) {
      var outstanding = 0;
      var jobs = [];
      function remove() {
        outstanding--;
        if (outstanding < count) {
          dequeue();
        }
      }
      function dequeue() {
        var job = jobs.shift();
        semaphore.queue = jobs.length;
        if (job) {
          run(job.fn).then(job.resolve).catch(job.reject);
        }
      }
      function queue(fn) {
        return new Promise(function(resolve, reject) {
          jobs.push({ fn, resolve, reject });
          semaphore.queue = jobs.length;
        });
      }
      function run(fn) {
        outstanding++;
        try {
          return Promise.resolve(fn()).then(function(result) {
            remove();
            return result;
          }, function(error) {
            remove();
            throw error;
          });
        } catch (err) {
          remove();
          return Promise.reject(err);
        }
      }
      var semaphore = function(fn) {
        if (outstanding >= count) {
          return queue(fn);
        } else {
          return run(fn);
        }
      };
      return semaphore;
    }
    function map(items, mapper) {
      var failed = false;
      var limit = this;
      return Promise.all(items.map(function() {
        var args2 = arguments;
        return limit(function() {
          if (!failed) {
            return mapper.apply(void 0, args2).catch(function(e) {
              failed = true;
              throw e;
            });
          }
        });
      }));
    }
    function addExtras(fn) {
      fn.queue = 0;
      fn.map = map;
      return fn;
    }
    module2.exports = function(count) {
      if (count) {
        return addExtras(limiter(count));
      } else {
        return addExtras(function(fn) {
          return fn();
        });
      }
    };
  }
});

// node_modules/@libsql/client/lib-esm/ws.js
function _createClient2(config) {
  if (config.scheme !== "wss" && config.scheme !== "ws") {
    throw new LibsqlError(`The WebSocket client supports only "libsql:", "wss:" and "ws:" URLs, got ${JSON.stringify(config.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
  }
  if (config.encryptionKey !== void 0) {
    throw new LibsqlError("Encryption key is not supported by the remote client.", "ENCRYPTION_KEY_NOT_SUPPORTED");
  }
  if (config.scheme === "ws" && config.tls) {
    throw new LibsqlError(`A "ws:" URL cannot opt into TLS by using ?tls=1`, "URL_INVALID");
  } else if (config.scheme === "wss" && !config.tls) {
    throw new LibsqlError(`A "wss:" URL cannot opt out of TLS by using ?tls=0`, "URL_INVALID");
  }
  const url = encodeBaseUrl(config.scheme, config.authority, config.path);
  let client;
  try {
    client = openWs(url, config.authToken);
  } catch (e) {
    if (e instanceof WebSocketUnsupportedError) {
      const suggestedScheme = config.scheme === "wss" ? "https" : "http";
      const suggestedUrl = encodeBaseUrl(suggestedScheme, config.authority, config.path);
      throw new LibsqlError(`This environment does not support WebSockets, please switch to the HTTP client by using a "${suggestedScheme}:" URL (${JSON.stringify(suggestedUrl)}). For more information, please read ${supportedUrlLink}`, "WEBSOCKETS_NOT_SUPPORTED");
    }
    throw mapHranaError(e);
  }
  return new WsClient2(client, url, config.authToken, config.intMode, config.concurrency);
}
var import_promise_limit, maxConnAgeMillis, sqlCacheCapacity, WsClient2, WsTransaction;
var init_ws = __esm({
  "node_modules/@libsql/client/lib-esm/ws.js"() {
    init_lib_esm();
    init_api();
    init_config();
    init_hrana();
    init_sql_cache();
    init_uri();
    init_util();
    import_promise_limit = __toESM(require_promise_limit(), 1);
    init_api();
    maxConnAgeMillis = 60 * 1e3;
    sqlCacheCapacity = 100;
    WsClient2 = class {
      #url;
      #authToken;
      #intMode;
      // State of the current connection. The `hrana.WsClient` inside may be closed at any moment due to an
      // asynchronous error.
      #connState;
      // If defined, this is a connection that will be used in the future, once it is ready.
      #futureConnState;
      closed;
      protocol;
      #isSchemaDatabase;
      #promiseLimitFunction;
      /** @private */
      constructor(client, url, authToken, intMode, concurrency) {
        this.#url = url;
        this.#authToken = authToken;
        this.#intMode = intMode;
        this.#connState = this.#openConn(client);
        this.#futureConnState = void 0;
        this.closed = false;
        this.protocol = "ws";
        this.#promiseLimitFunction = (0, import_promise_limit.default)(concurrency);
      }
      async limit(fn) {
        return this.#promiseLimitFunction(fn);
      }
      async execute(stmtOrSql, args2) {
        let stmt;
        if (typeof stmtOrSql === "string") {
          stmt = {
            sql: stmtOrSql,
            args: args2 || []
          };
        } else {
          stmt = stmtOrSql;
        }
        return this.limit(async () => {
          const streamState = await this.#openStream();
          try {
            const hranaStmt = stmtToHrana(stmt);
            streamState.conn.sqlCache.apply([hranaStmt]);
            const hranaRowsPromise = streamState.stream.query(hranaStmt);
            streamState.stream.closeGracefully();
            const hranaRowsResult = await hranaRowsPromise;
            return resultSetFromHrana(hranaRowsResult);
          } catch (e) {
            throw mapHranaError(e);
          } finally {
            this._closeStream(streamState);
          }
        });
      }
      async batch(stmts, mode = "deferred") {
        return this.limit(async () => {
          const streamState = await this.#openStream();
          try {
            const normalizedStmts = stmts.map((stmt) => {
              if (Array.isArray(stmt)) {
                return {
                  sql: stmt[0],
                  args: stmt[1] || []
                };
              }
              return stmt;
            });
            const hranaStmts = normalizedStmts.map(stmtToHrana);
            const version3 = await streamState.conn.client.getVersion();
            streamState.conn.sqlCache.apply(hranaStmts);
            const batch = streamState.stream.batch(version3 >= 3);
            const resultsPromise = executeHranaBatch(mode, version3, batch, hranaStmts);
            const results = await resultsPromise;
            return results;
          } catch (e) {
            throw mapHranaError(e);
          } finally {
            this._closeStream(streamState);
          }
        });
      }
      async migrate(stmts) {
        return this.limit(async () => {
          const streamState = await this.#openStream();
          try {
            const hranaStmts = stmts.map(stmtToHrana);
            const version3 = await streamState.conn.client.getVersion();
            const batch = streamState.stream.batch(version3 >= 3);
            const resultsPromise = executeHranaBatch("deferred", version3, batch, hranaStmts, true);
            const results = await resultsPromise;
            return results;
          } catch (e) {
            throw mapHranaError(e);
          } finally {
            this._closeStream(streamState);
          }
        });
      }
      async transaction(mode = "write") {
        return this.limit(async () => {
          const streamState = await this.#openStream();
          try {
            const version3 = await streamState.conn.client.getVersion();
            return new WsTransaction(this, streamState, mode, version3);
          } catch (e) {
            this._closeStream(streamState);
            throw mapHranaError(e);
          }
        });
      }
      async executeMultiple(sql2) {
        return this.limit(async () => {
          const streamState = await this.#openStream();
          try {
            const promise = streamState.stream.sequence(sql2);
            streamState.stream.closeGracefully();
            await promise;
          } catch (e) {
            throw mapHranaError(e);
          } finally {
            this._closeStream(streamState);
          }
        });
      }
      sync() {
        throw new LibsqlError("sync not supported in ws mode", "SYNC_NOT_SUPPORTED");
      }
      async #openStream() {
        if (this.closed) {
          throw new LibsqlError("The client is closed", "CLIENT_CLOSED");
        }
        const now = /* @__PURE__ */ new Date();
        const ageMillis = now.valueOf() - this.#connState.openTime.valueOf();
        if (ageMillis > maxConnAgeMillis && this.#futureConnState === void 0) {
          const futureConnState = this.#openConn();
          this.#futureConnState = futureConnState;
          futureConnState.client.getVersion().then((_version) => {
            if (this.#connState !== futureConnState) {
              if (this.#connState.streamStates.size === 0) {
                this.#connState.client.close();
              } else {
              }
            }
            this.#connState = futureConnState;
            this.#futureConnState = void 0;
          }, (_e) => {
            this.#futureConnState = void 0;
          });
        }
        if (this.#connState.client.closed) {
          try {
            if (this.#futureConnState !== void 0) {
              this.#connState = this.#futureConnState;
            } else {
              this.#connState = this.#openConn();
            }
          } catch (e) {
            throw mapHranaError(e);
          }
        }
        const connState = this.#connState;
        try {
          if (connState.useSqlCache === void 0) {
            connState.useSqlCache = await connState.client.getVersion() >= 2;
            if (connState.useSqlCache) {
              connState.sqlCache.capacity = sqlCacheCapacity;
            }
          }
          const stream = connState.client.openStream();
          stream.intMode = this.#intMode;
          const streamState = { conn: connState, stream };
          connState.streamStates.add(streamState);
          return streamState;
        } catch (e) {
          throw mapHranaError(e);
        }
      }
      #openConn(client) {
        try {
          client ??= openWs(this.#url, this.#authToken);
          return {
            client,
            useSqlCache: void 0,
            sqlCache: new SqlCache(client, 0),
            openTime: /* @__PURE__ */ new Date(),
            streamStates: /* @__PURE__ */ new Set()
          };
        } catch (e) {
          throw mapHranaError(e);
        }
      }
      async reconnect() {
        try {
          for (const st of Array.from(this.#connState.streamStates)) {
            try {
              st.stream.close();
            } catch {
            }
          }
          this.#connState.client.close();
        } catch {
        }
        if (this.#futureConnState) {
          try {
            this.#futureConnState.client.close();
          } catch {
          }
          this.#futureConnState = void 0;
        }
        const next = this.#openConn();
        const version3 = await next.client.getVersion();
        next.useSqlCache = version3 >= 2;
        if (next.useSqlCache) {
          next.sqlCache.capacity = sqlCacheCapacity;
        }
        this.#connState = next;
        this.closed = false;
      }
      _closeStream(streamState) {
        streamState.stream.close();
        const connState = streamState.conn;
        connState.streamStates.delete(streamState);
        if (connState.streamStates.size === 0 && connState !== this.#connState) {
          connState.client.close();
        }
      }
      close() {
        this.#connState.client.close();
        this.closed = true;
        if (this.#futureConnState) {
          try {
            this.#futureConnState.client.close();
          } catch {
          }
          this.#futureConnState = void 0;
        }
        this.closed = true;
      }
    };
    WsTransaction = class extends HranaTransaction {
      #client;
      #streamState;
      /** @private */
      constructor(client, state, mode, version3) {
        super(mode, version3);
        this.#client = client;
        this.#streamState = state;
      }
      /** @private */
      _getStream() {
        return this.#streamState.stream;
      }
      /** @private */
      _getSqlCache() {
        return this.#streamState.conn.sqlCache;
      }
      close() {
        this.#client._closeStream(this.#streamState);
      }
      get closed() {
        return this.#streamState.stream.closed;
      }
    };
  }
});

// node_modules/@libsql/client/lib-esm/http.js
function _createClient3(config) {
  if (config.scheme !== "https" && config.scheme !== "http") {
    throw new LibsqlError(`The HTTP client supports only "libsql:", "https:" and "http:" URLs, got ${JSON.stringify(config.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
  }
  if (config.encryptionKey !== void 0) {
    throw new LibsqlError("Encryption key is not supported by the remote client.", "ENCRYPTION_KEY_NOT_SUPPORTED");
  }
  if (config.scheme === "http" && config.tls) {
    throw new LibsqlError(`A "http:" URL cannot opt into TLS by using ?tls=1`, "URL_INVALID");
  } else if (config.scheme === "https" && !config.tls) {
    throw new LibsqlError(`A "https:" URL cannot opt out of TLS by using ?tls=0`, "URL_INVALID");
  }
  const url = encodeBaseUrl(config.scheme, config.authority, config.path);
  return new HttpClient2(url, config.authToken, config.intMode, config.fetch, config.concurrency, config.remoteEncryptionKey);
}
var import_promise_limit2, sqlCacheCapacity2, HttpClient2, HttpTransaction;
var init_http = __esm({
  "node_modules/@libsql/client/lib-esm/http.js"() {
    init_lib_esm();
    init_api();
    init_config();
    init_hrana();
    init_sql_cache();
    init_uri();
    init_util();
    import_promise_limit2 = __toESM(require_promise_limit(), 1);
    init_api();
    sqlCacheCapacity2 = 30;
    HttpClient2 = class {
      #client;
      protocol;
      #url;
      #intMode;
      #customFetch;
      #concurrency;
      #authToken;
      #remoteEncryptionKey;
      #promiseLimitFunction;
      /** @private */
      constructor(url, authToken, intMode, customFetch, concurrency, remoteEncryptionKey) {
        this.#url = url;
        this.#authToken = authToken;
        this.#intMode = intMode;
        this.#customFetch = customFetch;
        this.#concurrency = concurrency;
        this.#remoteEncryptionKey = remoteEncryptionKey;
        this.#client = openHttp(this.#url, this.#authToken, this.#customFetch, remoteEncryptionKey);
        this.#client.intMode = this.#intMode;
        this.protocol = "http";
        this.#promiseLimitFunction = (0, import_promise_limit2.default)(this.#concurrency);
      }
      async limit(fn) {
        return this.#promiseLimitFunction(fn);
      }
      async execute(stmtOrSql, args2) {
        let stmt;
        if (typeof stmtOrSql === "string") {
          stmt = {
            sql: stmtOrSql,
            args: args2 || []
          };
        } else {
          stmt = stmtOrSql;
        }
        return this.limit(async () => {
          try {
            const hranaStmt = stmtToHrana(stmt);
            let rowsPromise;
            const stream = this.#client.openStream();
            try {
              rowsPromise = stream.query(hranaStmt);
            } finally {
              stream.closeGracefully();
            }
            const rowsResult = await rowsPromise;
            return resultSetFromHrana(rowsResult);
          } catch (e) {
            throw mapHranaError(e);
          }
        });
      }
      async batch(stmts, mode = "deferred") {
        return this.limit(async () => {
          try {
            const normalizedStmts = stmts.map((stmt) => {
              if (Array.isArray(stmt)) {
                return {
                  sql: stmt[0],
                  args: stmt[1] || []
                };
              }
              return stmt;
            });
            const hranaStmts = normalizedStmts.map(stmtToHrana);
            const version3 = await this.#client.getVersion();
            let resultsPromise;
            const stream = this.#client.openStream();
            try {
              const sqlCache = new SqlCache(stream, sqlCacheCapacity2);
              sqlCache.apply(hranaStmts);
              const batch = stream.batch(false);
              resultsPromise = executeHranaBatch(mode, version3, batch, hranaStmts);
            } finally {
              stream.closeGracefully();
            }
            const results = await resultsPromise;
            return results;
          } catch (e) {
            throw mapHranaError(e);
          }
        });
      }
      async migrate(stmts) {
        return this.limit(async () => {
          try {
            const hranaStmts = stmts.map(stmtToHrana);
            const version3 = await this.#client.getVersion();
            let resultsPromise;
            const stream = this.#client.openStream();
            try {
              const batch = stream.batch(false);
              resultsPromise = executeHranaBatch("deferred", version3, batch, hranaStmts, true);
            } finally {
              stream.closeGracefully();
            }
            const results = await resultsPromise;
            return results;
          } catch (e) {
            throw mapHranaError(e);
          }
        });
      }
      async transaction(mode = "write") {
        return this.limit(async () => {
          try {
            const version3 = await this.#client.getVersion();
            return new HttpTransaction(this.#client.openStream(), mode, version3);
          } catch (e) {
            throw mapHranaError(e);
          }
        });
      }
      async executeMultiple(sql2) {
        return this.limit(async () => {
          try {
            let promise;
            const stream = this.#client.openStream();
            try {
              promise = stream.sequence(sql2);
            } finally {
              stream.closeGracefully();
            }
            await promise;
          } catch (e) {
            throw mapHranaError(e);
          }
        });
      }
      sync() {
        throw new LibsqlError("sync not supported in http mode", "SYNC_NOT_SUPPORTED");
      }
      close() {
        this.#client.close();
      }
      async reconnect() {
        try {
          if (!this.closed) {
            this.#client.close();
          }
        } finally {
          this.#client = openHttp(this.#url, this.#authToken, this.#customFetch, this.#remoteEncryptionKey);
          this.#client.intMode = this.#intMode;
        }
      }
      get closed() {
        return this.#client.closed;
      }
    };
    HttpTransaction = class extends HranaTransaction {
      #stream;
      #sqlCache;
      /** @private */
      constructor(stream, mode, version3) {
        super(mode, version3);
        this.#stream = stream;
        this.#sqlCache = new SqlCache(stream, sqlCacheCapacity2);
      }
      /** @private */
      _getStream() {
        return this.#stream;
      }
      /** @private */
      _getSqlCache() {
        return this.#sqlCache;
      }
      close() {
        this.#stream.close();
      }
      get closed() {
        return this.#stream.closed;
      }
    };
  }
});

// node_modules/@libsql/client/lib-esm/node.js
function createClient(config) {
  return _createClient4(expandConfig(config, true));
}
function _createClient4(config) {
  if (config.scheme === "wss" || config.scheme === "ws") {
    return _createClient2(config);
  } else if (config.scheme === "https" || config.scheme === "http") {
    return _createClient3(config);
  } else {
    return _createClient(config);
  }
}
var init_node2 = __esm({
  "node_modules/@libsql/client/lib-esm/node.js"() {
    init_config();
    init_sqlite3();
    init_ws();
    init_http();
    init_api();
  }
});

// node_modules/drizzle-orm/selection-proxy.js
var SelectionProxyHandler;
var init_selection_proxy = __esm({
  "node_modules/drizzle-orm/selection-proxy.js"() {
    init_alias();
    init_column();
    init_entity();
    init_sql();
    init_subquery();
    init_view_common();
    SelectionProxyHandler = class _SelectionProxyHandler {
      static [entityKind] = "SelectionProxyHandler";
      config;
      constructor(config) {
        this.config = { ...config };
      }
      get(subquery, prop) {
        if (prop === "_") {
          return {
            ...subquery["_"],
            selectedFields: new Proxy(
              subquery._.selectedFields,
              this
            )
          };
        }
        if (prop === ViewBaseConfig) {
          return {
            ...subquery[ViewBaseConfig],
            selectedFields: new Proxy(
              subquery[ViewBaseConfig].selectedFields,
              this
            )
          };
        }
        if (typeof prop === "symbol") {
          return subquery[prop];
        }
        const columns = is(subquery, Subquery) ? subquery._.selectedFields : is(subquery, View) ? subquery[ViewBaseConfig].selectedFields : subquery;
        const value = columns[prop];
        if (is(value, SQL.Aliased)) {
          if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField) {
            return value.sql;
          }
          const newValue = value.clone();
          newValue.isSelectionField = true;
          return newValue;
        }
        if (is(value, SQL)) {
          if (this.config.sqlBehavior === "sql") {
            return value;
          }
          throw new Error(
            `You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
          );
        }
        if (is(value, Column)) {
          if (this.config.alias) {
            return new Proxy(
              value,
              new ColumnAliasProxyHandler(
                new Proxy(
                  value.table,
                  new TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false)
                )
              )
            );
          }
          return value;
        }
        if (typeof value !== "object" || value === null) {
          return value;
        }
        return new Proxy(value, new _SelectionProxyHandler(this.config));
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/foreign-keys.js
var ForeignKeyBuilder2, ForeignKey2;
var init_foreign_keys2 = __esm({
  "node_modules/drizzle-orm/sqlite-core/foreign-keys.js"() {
    init_entity();
    init_table_utils();
    ForeignKeyBuilder2 = class {
      static [entityKind] = "SQLiteForeignKeyBuilder";
      /** @internal */
      reference;
      /** @internal */
      _onUpdate;
      /** @internal */
      _onDelete;
      constructor(config, actions) {
        this.reference = () => {
          const { name, columns, foreignColumns } = config();
          return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
        };
        if (actions) {
          this._onUpdate = actions.onUpdate;
          this._onDelete = actions.onDelete;
        }
      }
      onUpdate(action) {
        this._onUpdate = action;
        return this;
      }
      onDelete(action) {
        this._onDelete = action;
        return this;
      }
      /** @internal */
      build(table) {
        return new ForeignKey2(table, this);
      }
    };
    ForeignKey2 = class {
      constructor(table, builder) {
        this.table = table;
        this.reference = builder.reference;
        this.onUpdate = builder._onUpdate;
        this.onDelete = builder._onDelete;
      }
      static [entityKind] = "SQLiteForeignKey";
      reference;
      onUpdate;
      onDelete;
      getName() {
        const { name, columns, foreignColumns } = this.reference();
        const columnNames = columns.map((column) => column.name);
        const foreignColumnNames = foreignColumns.map((column) => column.name);
        const chunks = [
          this.table[TableName],
          ...columnNames,
          foreignColumns[0].table[TableName],
          ...foreignColumnNames
        ];
        return name ?? `${chunks.join("_")}_fk`;
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/unique-constraint.js
function uniqueKeyName2(table, columns) {
  return `${table[TableName]}_${columns.join("_")}_unique`;
}
var UniqueConstraintBuilder2, UniqueOnConstraintBuilder2, UniqueConstraint2;
var init_unique_constraint2 = __esm({
  "node_modules/drizzle-orm/sqlite-core/unique-constraint.js"() {
    init_entity();
    init_table_utils();
    UniqueConstraintBuilder2 = class {
      constructor(columns, name) {
        this.name = name;
        this.columns = columns;
      }
      static [entityKind] = "SQLiteUniqueConstraintBuilder";
      /** @internal */
      columns;
      /** @internal */
      build(table) {
        return new UniqueConstraint2(table, this.columns, this.name);
      }
    };
    UniqueOnConstraintBuilder2 = class {
      static [entityKind] = "SQLiteUniqueOnConstraintBuilder";
      /** @internal */
      name;
      constructor(name) {
        this.name = name;
      }
      on(...columns) {
        return new UniqueConstraintBuilder2(columns, this.name);
      }
    };
    UniqueConstraint2 = class {
      constructor(table, columns, name) {
        this.table = table;
        this.columns = columns;
        this.name = name ?? uniqueKeyName2(this.table, this.columns.map((column) => column.name));
      }
      static [entityKind] = "SQLiteUniqueConstraint";
      columns;
      name;
      getName() {
        return this.name;
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/columns/common.js
var SQLiteColumnBuilder, SQLiteColumn;
var init_common2 = __esm({
  "node_modules/drizzle-orm/sqlite-core/columns/common.js"() {
    init_column_builder();
    init_column();
    init_entity();
    init_foreign_keys2();
    init_unique_constraint2();
    SQLiteColumnBuilder = class extends ColumnBuilder {
      static [entityKind] = "SQLiteColumnBuilder";
      foreignKeyConfigs = [];
      references(ref, actions = {}) {
        this.foreignKeyConfigs.push({ ref, actions });
        return this;
      }
      unique(name) {
        this.config.isUnique = true;
        this.config.uniqueName = name;
        return this;
      }
      generatedAlwaysAs(as, config) {
        this.config.generated = {
          as,
          type: "always",
          mode: config?.mode ?? "virtual"
        };
        return this;
      }
      /** @internal */
      buildForeignKeys(column, table) {
        return this.foreignKeyConfigs.map(({ ref, actions }) => {
          return ((ref2, actions2) => {
            const builder = new ForeignKeyBuilder2(() => {
              const foreignColumn = ref2();
              return { columns: [column], foreignColumns: [foreignColumn] };
            });
            if (actions2.onUpdate) {
              builder.onUpdate(actions2.onUpdate);
            }
            if (actions2.onDelete) {
              builder.onDelete(actions2.onDelete);
            }
            return builder.build(table);
          })(ref, actions);
        });
      }
    };
    SQLiteColumn = class extends Column {
      constructor(table, config) {
        if (!config.uniqueName) {
          config.uniqueName = uniqueKeyName2(table, [config.name]);
        }
        super(table, config);
        this.table = table;
      }
      static [entityKind] = "SQLiteColumn";
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/columns/blob.js
function blob(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config?.mode === "json") {
    return new SQLiteBlobJsonBuilder(name);
  }
  if (config?.mode === "bigint") {
    return new SQLiteBigIntBuilder(name);
  }
  return new SQLiteBlobBufferBuilder(name);
}
var SQLiteBigIntBuilder, SQLiteBigInt, SQLiteBlobJsonBuilder, SQLiteBlobJson, SQLiteBlobBufferBuilder, SQLiteBlobBuffer;
var init_blob = __esm({
  "node_modules/drizzle-orm/sqlite-core/columns/blob.js"() {
    init_entity();
    init_utils();
    init_common2();
    SQLiteBigIntBuilder = class extends SQLiteColumnBuilder {
      static [entityKind] = "SQLiteBigIntBuilder";
      constructor(name) {
        super(name, "bigint", "SQLiteBigInt");
      }
      /** @internal */
      build(table) {
        return new SQLiteBigInt(table, this.config);
      }
    };
    SQLiteBigInt = class extends SQLiteColumn {
      static [entityKind] = "SQLiteBigInt";
      getSQLType() {
        return "blob";
      }
      mapFromDriverValue(value) {
        if (typeof Buffer !== "undefined" && Buffer.from) {
          const buf = Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value);
          return BigInt(buf.toString("utf8"));
        }
        return BigInt(textDecoder.decode(value));
      }
      mapToDriverValue(value) {
        return Buffer.from(value.toString());
      }
    };
    SQLiteBlobJsonBuilder = class extends SQLiteColumnBuilder {
      static [entityKind] = "SQLiteBlobJsonBuilder";
      constructor(name) {
        super(name, "json", "SQLiteBlobJson");
      }
      /** @internal */
      build(table) {
        return new SQLiteBlobJson(
          table,
          this.config
        );
      }
    };
    SQLiteBlobJson = class extends SQLiteColumn {
      static [entityKind] = "SQLiteBlobJson";
      getSQLType() {
        return "blob";
      }
      mapFromDriverValue(value) {
        if (typeof Buffer !== "undefined" && Buffer.from) {
          const buf = Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value);
          return JSON.parse(buf.toString("utf8"));
        }
        return JSON.parse(textDecoder.decode(value));
      }
      mapToDriverValue(value) {
        return Buffer.from(JSON.stringify(value));
      }
    };
    SQLiteBlobBufferBuilder = class extends SQLiteColumnBuilder {
      static [entityKind] = "SQLiteBlobBufferBuilder";
      constructor(name) {
        super(name, "buffer", "SQLiteBlobBuffer");
      }
      /** @internal */
      build(table) {
        return new SQLiteBlobBuffer(table, this.config);
      }
    };
    SQLiteBlobBuffer = class extends SQLiteColumn {
      static [entityKind] = "SQLiteBlobBuffer";
      mapFromDriverValue(value) {
        if (Buffer.isBuffer(value)) {
          return value;
        }
        return Buffer.from(value);
      }
      getSQLType() {
        return "blob";
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/columns/custom.js
function customType(customTypeParams) {
  return (a, b) => {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new SQLiteCustomColumnBuilder(
      name,
      config,
      customTypeParams
    );
  };
}
var SQLiteCustomColumnBuilder, SQLiteCustomColumn;
var init_custom = __esm({
  "node_modules/drizzle-orm/sqlite-core/columns/custom.js"() {
    init_entity();
    init_utils();
    init_common2();
    SQLiteCustomColumnBuilder = class extends SQLiteColumnBuilder {
      static [entityKind] = "SQLiteCustomColumnBuilder";
      constructor(name, fieldConfig, customTypeParams) {
        super(name, "custom", "SQLiteCustomColumn");
        this.config.fieldConfig = fieldConfig;
        this.config.customTypeParams = customTypeParams;
      }
      /** @internal */
      build(table) {
        return new SQLiteCustomColumn(
          table,
          this.config
        );
      }
    };
    SQLiteCustomColumn = class extends SQLiteColumn {
      static [entityKind] = "SQLiteCustomColumn";
      sqlName;
      mapTo;
      mapFrom;
      constructor(table, config) {
        super(table, config);
        this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
        this.mapTo = config.customTypeParams.toDriver;
        this.mapFrom = config.customTypeParams.fromDriver;
      }
      getSQLType() {
        return this.sqlName;
      }
      mapFromDriverValue(value) {
        return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
      }
      mapToDriverValue(value) {
        return typeof this.mapTo === "function" ? this.mapTo(value) : value;
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/columns/integer.js
function integer(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config?.mode === "timestamp" || config?.mode === "timestamp_ms") {
    return new SQLiteTimestampBuilder(name, config.mode);
  }
  if (config?.mode === "boolean") {
    return new SQLiteBooleanBuilder(name, config.mode);
  }
  return new SQLiteIntegerBuilder(name);
}
var SQLiteBaseIntegerBuilder, SQLiteBaseInteger, SQLiteIntegerBuilder, SQLiteInteger, SQLiteTimestampBuilder, SQLiteTimestamp, SQLiteBooleanBuilder, SQLiteBoolean;
var init_integer = __esm({
  "node_modules/drizzle-orm/sqlite-core/columns/integer.js"() {
    init_entity();
    init_sql();
    init_utils();
    init_common2();
    SQLiteBaseIntegerBuilder = class extends SQLiteColumnBuilder {
      static [entityKind] = "SQLiteBaseIntegerBuilder";
      constructor(name, dataType, columnType) {
        super(name, dataType, columnType);
        this.config.autoIncrement = false;
      }
      primaryKey(config) {
        if (config?.autoIncrement) {
          this.config.autoIncrement = true;
        }
        this.config.hasDefault = true;
        return super.primaryKey();
      }
    };
    SQLiteBaseInteger = class extends SQLiteColumn {
      static [entityKind] = "SQLiteBaseInteger";
      autoIncrement = this.config.autoIncrement;
      getSQLType() {
        return "integer";
      }
    };
    SQLiteIntegerBuilder = class extends SQLiteBaseIntegerBuilder {
      static [entityKind] = "SQLiteIntegerBuilder";
      constructor(name) {
        super(name, "number", "SQLiteInteger");
      }
      build(table) {
        return new SQLiteInteger(
          table,
          this.config
        );
      }
    };
    SQLiteInteger = class extends SQLiteBaseInteger {
      static [entityKind] = "SQLiteInteger";
    };
    SQLiteTimestampBuilder = class extends SQLiteBaseIntegerBuilder {
      static [entityKind] = "SQLiteTimestampBuilder";
      constructor(name, mode) {
        super(name, "date", "SQLiteTimestamp");
        this.config.mode = mode;
      }
      /**
       * @deprecated Use `default()` with your own expression instead.
       *
       * Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
       */
      defaultNow() {
        return this.default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
      }
      build(table) {
        return new SQLiteTimestamp(
          table,
          this.config
        );
      }
    };
    SQLiteTimestamp = class extends SQLiteBaseInteger {
      static [entityKind] = "SQLiteTimestamp";
      mode = this.config.mode;
      mapFromDriverValue(value) {
        if (this.config.mode === "timestamp") {
          return new Date(value * 1e3);
        }
        return new Date(value);
      }
      mapToDriverValue(value) {
        const unix = value.getTime();
        if (this.config.mode === "timestamp") {
          return Math.floor(unix / 1e3);
        }
        return unix;
      }
    };
    SQLiteBooleanBuilder = class extends SQLiteBaseIntegerBuilder {
      static [entityKind] = "SQLiteBooleanBuilder";
      constructor(name, mode) {
        super(name, "boolean", "SQLiteBoolean");
        this.config.mode = mode;
      }
      build(table) {
        return new SQLiteBoolean(
          table,
          this.config
        );
      }
    };
    SQLiteBoolean = class extends SQLiteBaseInteger {
      static [entityKind] = "SQLiteBoolean";
      mode = this.config.mode;
      mapFromDriverValue(value) {
        return Number(value) === 1;
      }
      mapToDriverValue(value) {
        return value ? 1 : 0;
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/columns/numeric.js
function numeric(a, b) {
  const { name, config } = getColumnNameAndConfig(a, b);
  const mode = config?.mode;
  return mode === "number" ? new SQLiteNumericNumberBuilder(name) : mode === "bigint" ? new SQLiteNumericBigIntBuilder(name) : new SQLiteNumericBuilder(name);
}
var SQLiteNumericBuilder, SQLiteNumeric, SQLiteNumericNumberBuilder, SQLiteNumericNumber, SQLiteNumericBigIntBuilder, SQLiteNumericBigInt;
var init_numeric = __esm({
  "node_modules/drizzle-orm/sqlite-core/columns/numeric.js"() {
    init_entity();
    init_utils();
    init_common2();
    SQLiteNumericBuilder = class extends SQLiteColumnBuilder {
      static [entityKind] = "SQLiteNumericBuilder";
      constructor(name) {
        super(name, "string", "SQLiteNumeric");
      }
      /** @internal */
      build(table) {
        return new SQLiteNumeric(
          table,
          this.config
        );
      }
    };
    SQLiteNumeric = class extends SQLiteColumn {
      static [entityKind] = "SQLiteNumeric";
      mapFromDriverValue(value) {
        if (typeof value === "string")
          return value;
        return String(value);
      }
      getSQLType() {
        return "numeric";
      }
    };
    SQLiteNumericNumberBuilder = class extends SQLiteColumnBuilder {
      static [entityKind] = "SQLiteNumericNumberBuilder";
      constructor(name) {
        super(name, "number", "SQLiteNumericNumber");
      }
      /** @internal */
      build(table) {
        return new SQLiteNumericNumber(
          table,
          this.config
        );
      }
    };
    SQLiteNumericNumber = class extends SQLiteColumn {
      static [entityKind] = "SQLiteNumericNumber";
      mapFromDriverValue(value) {
        if (typeof value === "number")
          return value;
        return Number(value);
      }
      mapToDriverValue = String;
      getSQLType() {
        return "numeric";
      }
    };
    SQLiteNumericBigIntBuilder = class extends SQLiteColumnBuilder {
      static [entityKind] = "SQLiteNumericBigIntBuilder";
      constructor(name) {
        super(name, "bigint", "SQLiteNumericBigInt");
      }
      /** @internal */
      build(table) {
        return new SQLiteNumericBigInt(
          table,
          this.config
        );
      }
    };
    SQLiteNumericBigInt = class extends SQLiteColumn {
      static [entityKind] = "SQLiteNumericBigInt";
      mapFromDriverValue = BigInt;
      mapToDriverValue = String;
      getSQLType() {
        return "numeric";
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/columns/real.js
function real(name) {
  return new SQLiteRealBuilder(name ?? "");
}
var SQLiteRealBuilder, SQLiteReal;
var init_real = __esm({
  "node_modules/drizzle-orm/sqlite-core/columns/real.js"() {
    init_entity();
    init_common2();
    SQLiteRealBuilder = class extends SQLiteColumnBuilder {
      static [entityKind] = "SQLiteRealBuilder";
      constructor(name) {
        super(name, "number", "SQLiteReal");
      }
      /** @internal */
      build(table) {
        return new SQLiteReal(table, this.config);
      }
    };
    SQLiteReal = class extends SQLiteColumn {
      static [entityKind] = "SQLiteReal";
      getSQLType() {
        return "real";
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/columns/text.js
function text(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  if (config.mode === "json") {
    return new SQLiteTextJsonBuilder(name);
  }
  return new SQLiteTextBuilder(name, config);
}
var SQLiteTextBuilder, SQLiteText, SQLiteTextJsonBuilder, SQLiteTextJson;
var init_text = __esm({
  "node_modules/drizzle-orm/sqlite-core/columns/text.js"() {
    init_entity();
    init_utils();
    init_common2();
    SQLiteTextBuilder = class extends SQLiteColumnBuilder {
      static [entityKind] = "SQLiteTextBuilder";
      constructor(name, config) {
        super(name, "string", "SQLiteText");
        this.config.enumValues = config.enum;
        this.config.length = config.length;
      }
      /** @internal */
      build(table) {
        return new SQLiteText(
          table,
          this.config
        );
      }
    };
    SQLiteText = class extends SQLiteColumn {
      static [entityKind] = "SQLiteText";
      enumValues = this.config.enumValues;
      length = this.config.length;
      constructor(table, config) {
        super(table, config);
      }
      getSQLType() {
        return `text${this.config.length ? `(${this.config.length})` : ""}`;
      }
    };
    SQLiteTextJsonBuilder = class extends SQLiteColumnBuilder {
      static [entityKind] = "SQLiteTextJsonBuilder";
      constructor(name) {
        super(name, "json", "SQLiteTextJson");
      }
      /** @internal */
      build(table) {
        return new SQLiteTextJson(
          table,
          this.config
        );
      }
    };
    SQLiteTextJson = class extends SQLiteColumn {
      static [entityKind] = "SQLiteTextJson";
      getSQLType() {
        return "text";
      }
      mapFromDriverValue(value) {
        return JSON.parse(value);
      }
      mapToDriverValue(value) {
        return JSON.stringify(value);
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/columns/all.js
function getSQLiteColumnBuilders() {
  return {
    blob,
    customType,
    integer,
    numeric,
    real,
    text
  };
}
var init_all = __esm({
  "node_modules/drizzle-orm/sqlite-core/columns/all.js"() {
    init_blob();
    init_custom();
    init_integer();
    init_numeric();
    init_real();
    init_text();
  }
});

// node_modules/drizzle-orm/sqlite-core/table.js
function sqliteTableBase(name, columns, extraConfig, schema, baseName = name) {
  const rawTable = new SQLiteTable(name, schema, baseName);
  const parsedColumns = typeof columns === "function" ? columns(getSQLiteColumnBuilders()) : columns;
  const builtColumns = Object.fromEntries(
    Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      colBuilder.setName(name2);
      const column = colBuilder.build(rawTable);
      rawTable[InlineForeignKeys2].push(...colBuilder.buildForeignKeys(column, rawTable));
      return [name2, column];
    })
  );
  const table = Object.assign(rawTable, builtColumns);
  table[Table.Symbol.Columns] = builtColumns;
  table[Table.Symbol.ExtraConfigColumns] = builtColumns;
  if (extraConfig) {
    table[SQLiteTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return table;
}
var InlineForeignKeys2, SQLiteTable, sqliteTable;
var init_table3 = __esm({
  "node_modules/drizzle-orm/sqlite-core/table.js"() {
    init_entity();
    init_table();
    init_all();
    InlineForeignKeys2 = Symbol.for("drizzle:SQLiteInlineForeignKeys");
    SQLiteTable = class extends Table {
      static [entityKind] = "SQLiteTable";
      /** @internal */
      static Symbol = Object.assign({}, Table.Symbol, {
        InlineForeignKeys: InlineForeignKeys2
      });
      /** @internal */
      [Table.Symbol.Columns];
      /** @internal */
      [InlineForeignKeys2] = [];
      /** @internal */
      [Table.Symbol.ExtraConfigBuilder] = void 0;
    };
    sqliteTable = (name, columns, extraConfig) => {
      return sqliteTableBase(name, columns, extraConfig);
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/checks.js
var CheckBuilder, Check;
var init_checks = __esm({
  "node_modules/drizzle-orm/sqlite-core/checks.js"() {
    init_entity();
    CheckBuilder = class {
      constructor(name, value) {
        this.name = name;
        this.value = value;
      }
      static [entityKind] = "SQLiteCheckBuilder";
      brand;
      build(table) {
        return new Check(table, this);
      }
    };
    Check = class {
      constructor(table, builder) {
        this.table = table;
        this.name = builder.name;
        this.value = builder.value;
      }
      static [entityKind] = "SQLiteCheck";
      name;
      value;
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/indexes.js
var IndexBuilderOn, IndexBuilder, Index;
var init_indexes = __esm({
  "node_modules/drizzle-orm/sqlite-core/indexes.js"() {
    init_entity();
    IndexBuilderOn = class {
      constructor(name, unique) {
        this.name = name;
        this.unique = unique;
      }
      static [entityKind] = "SQLiteIndexBuilderOn";
      on(...columns) {
        return new IndexBuilder(this.name, columns, this.unique);
      }
    };
    IndexBuilder = class {
      static [entityKind] = "SQLiteIndexBuilder";
      /** @internal */
      config;
      constructor(name, columns, unique) {
        this.config = {
          name,
          columns,
          unique,
          where: void 0
        };
      }
      /**
       * Condition for partial index.
       */
      where(condition) {
        this.config.where = condition;
        return this;
      }
      /** @internal */
      build(table) {
        return new Index(this.config, table);
      }
    };
    Index = class {
      static [entityKind] = "SQLiteIndex";
      config;
      constructor(config, table) {
        this.config = { ...config, table };
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/primary-keys.js
var PrimaryKeyBuilder2, PrimaryKey2;
var init_primary_keys2 = __esm({
  "node_modules/drizzle-orm/sqlite-core/primary-keys.js"() {
    init_entity();
    init_table3();
    PrimaryKeyBuilder2 = class {
      static [entityKind] = "SQLitePrimaryKeyBuilder";
      /** @internal */
      columns;
      /** @internal */
      name;
      constructor(columns, name) {
        this.columns = columns;
        this.name = name;
      }
      /** @internal */
      build(table) {
        return new PrimaryKey2(table, this.columns, this.name);
      }
    };
    PrimaryKey2 = class {
      constructor(table, columns, name) {
        this.table = table;
        this.columns = columns;
        this.name = name;
      }
      static [entityKind] = "SQLitePrimaryKey";
      columns;
      name;
      getName() {
        return this.name ?? `${this.table[SQLiteTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/utils.js
function extractUsedTable(table) {
  if (is(table, SQLiteTable)) {
    return [`${table[Table.Symbol.BaseName]}`];
  }
  if (is(table, Subquery)) {
    return table._.usedTables ?? [];
  }
  if (is(table, SQL)) {
    return table.usedTables ?? [];
  }
  return [];
}
var init_utils2 = __esm({
  "node_modules/drizzle-orm/sqlite-core/utils.js"() {
    init_entity();
    init_sql();
    init_subquery();
    init_table();
    init_table3();
  }
});

// node_modules/drizzle-orm/sqlite-core/query-builders/delete.js
var SQLiteDeleteBase;
var init_delete = __esm({
  "node_modules/drizzle-orm/sqlite-core/query-builders/delete.js"() {
    init_entity();
    init_query_promise();
    init_selection_proxy();
    init_table3();
    init_table();
    init_utils();
    init_utils2();
    SQLiteDeleteBase = class extends QueryPromise {
      constructor(table, session, dialect, withList) {
        super();
        this.table = table;
        this.session = session;
        this.dialect = dialect;
        this.config = { table, withList };
      }
      static [entityKind] = "SQLiteDelete";
      /** @internal */
      config;
      /**
       * Adds a `where` clause to the query.
       *
       * Calling this method will delete only those rows that fulfill a specified condition.
       *
       * See docs: {@link https://orm.drizzle.team/docs/delete}
       *
       * @param where the `where` clause.
       *
       * @example
       * You can use conditional operators and `sql function` to filter the rows to be deleted.
       *
       * ```ts
       * // Delete all cars with green color
       * db.delete(cars).where(eq(cars.color, 'green'));
       * // or
       * db.delete(cars).where(sql`${cars.color} = 'green'`)
       * ```
       *
       * You can logically combine conditional operators with `and()` and `or()` operators:
       *
       * ```ts
       * // Delete all BMW cars with a green color
       * db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
       *
       * // Delete all cars with the green or blue color
       * db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
       * ```
       */
      where(where) {
        this.config.where = where;
        return this;
      }
      orderBy(...columns) {
        if (typeof columns[0] === "function") {
          const orderBy = columns[0](
            new Proxy(
              this.config.table[Table.Symbol.Columns],
              new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
            )
          );
          const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
          this.config.orderBy = orderByArray;
        } else {
          const orderByArray = columns;
          this.config.orderBy = orderByArray;
        }
        return this;
      }
      limit(limit) {
        this.config.limit = limit;
        return this;
      }
      returning(fields = this.table[SQLiteTable.Symbol.Columns]) {
        this.config.returning = orderSelectedFields(fields);
        return this;
      }
      /** @internal */
      getSQL() {
        return this.dialect.buildDeleteQuery(this.config);
      }
      toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
        return rest;
      }
      /** @internal */
      _prepare(isOneTimeQuery = true) {
        return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
          this.dialect.sqlToQuery(this.getSQL()),
          this.config.returning,
          this.config.returning ? "all" : "run",
          true,
          void 0,
          {
            type: "delete",
            tables: extractUsedTable(this.config.table)
          }
        );
      }
      prepare() {
        return this._prepare(false);
      }
      run = (placeholderValues) => {
        return this._prepare().run(placeholderValues);
      };
      all = (placeholderValues) => {
        return this._prepare().all(placeholderValues);
      };
      get = (placeholderValues) => {
        return this._prepare().get(placeholderValues);
      };
      values = (placeholderValues) => {
        return this._prepare().values(placeholderValues);
      };
      async execute(placeholderValues) {
        return this._prepare().execute(placeholderValues);
      }
      $dynamic() {
        return this;
      }
    };
  }
});

// node_modules/drizzle-orm/casing.js
function toSnakeCase(input) {
  const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
  return words.map((word) => word.toLowerCase()).join("_");
}
function toCamelCase(input) {
  const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
  return words.reduce((acc, word, i) => {
    const formattedWord = i === 0 ? word.toLowerCase() : `${word[0].toUpperCase()}${word.slice(1)}`;
    return acc + formattedWord;
  }, "");
}
function noopCase(input) {
  return input;
}
var CasingCache;
var init_casing = __esm({
  "node_modules/drizzle-orm/casing.js"() {
    init_entity();
    init_table();
    CasingCache = class {
      static [entityKind] = "CasingCache";
      /** @internal */
      cache = {};
      cachedTables = {};
      convert;
      constructor(casing) {
        this.convert = casing === "snake_case" ? toSnakeCase : casing === "camelCase" ? toCamelCase : noopCase;
      }
      getColumnCasing(column) {
        if (!column.keyAsName)
          return column.name;
        const schema = column.table[Table.Symbol.Schema] ?? "public";
        const tableName = column.table[Table.Symbol.OriginalName];
        const key = `${schema}.${tableName}.${column.name}`;
        if (!this.cache[key]) {
          this.cacheTable(column.table);
        }
        return this.cache[key];
      }
      cacheTable(table) {
        const schema = table[Table.Symbol.Schema] ?? "public";
        const tableName = table[Table.Symbol.OriginalName];
        const tableKey = `${schema}.${tableName}`;
        if (!this.cachedTables[tableKey]) {
          for (const column of Object.values(table[Table.Symbol.Columns])) {
            const columnKey = `${tableKey}.${column.name}`;
            this.cache[columnKey] = this.convert(column.name);
          }
          this.cachedTables[tableKey] = true;
        }
      }
      clearCache() {
        this.cache = {};
        this.cachedTables = {};
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/columns/index.js
var init_columns = __esm({
  "node_modules/drizzle-orm/sqlite-core/columns/index.js"() {
    init_blob();
    init_common2();
    init_custom();
    init_integer();
    init_numeric();
    init_real();
    init_text();
  }
});

// node_modules/drizzle-orm/sqlite-core/view-base.js
var SQLiteViewBase;
var init_view_base = __esm({
  "node_modules/drizzle-orm/sqlite-core/view-base.js"() {
    init_entity();
    init_sql();
    SQLiteViewBase = class extends View {
      static [entityKind] = "SQLiteViewBase";
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/dialect.js
var SQLiteDialect, SQLiteSyncDialect, SQLiteAsyncDialect;
var init_dialect = __esm({
  "node_modules/drizzle-orm/sqlite-core/dialect.js"() {
    init_alias();
    init_casing();
    init_column();
    init_entity();
    init_errors();
    init_relations();
    init_sql2();
    init_sql();
    init_columns();
    init_table3();
    init_subquery();
    init_table();
    init_utils();
    init_view_common();
    init_view_base();
    SQLiteDialect = class {
      static [entityKind] = "SQLiteDialect";
      /** @internal */
      casing;
      constructor(config) {
        this.casing = new CasingCache(config?.casing);
      }
      escapeName(name) {
        return `"${name.replace(/"/g, '""')}"`;
      }
      escapeParam(_num) {
        return "?";
      }
      escapeString(str) {
        return `'${str.replace(/'/g, "''")}'`;
      }
      buildWithCTE(queries) {
        if (!queries?.length)
          return void 0;
        const withSqlChunks = [sql`with `];
        for (const [i, w] of queries.entries()) {
          withSqlChunks.push(sql`${sql.identifier(w._.alias)} as (${w._.sql})`);
          if (i < queries.length - 1) {
            withSqlChunks.push(sql`, `);
          }
        }
        withSqlChunks.push(sql` `);
        return sql.join(withSqlChunks);
      }
      buildDeleteQuery({
        table,
        where,
        returning,
        withList,
        limit,
        orderBy
      }) {
        const withSql = this.buildWithCTE(withList);
        const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
        const whereSql = where ? sql` where ${where}` : void 0;
        const orderBySql = this.buildOrderBy(orderBy);
        const limitSql = this.buildLimit(limit);
        return sql`${withSql}delete from ${table}${whereSql}${returningSql}${orderBySql}${limitSql}`;
      }
      buildUpdateSet(table, set) {
        const tableColumns = table[Table.Symbol.Columns];
        const columnNames = Object.keys(tableColumns).filter(
          (colName) => set[colName] !== void 0 || tableColumns[colName]?.onUpdateFn !== void 0
        );
        const setSize = columnNames.length;
        return sql.join(
          columnNames.flatMap((colName, i) => {
            const col = tableColumns[colName];
            const onUpdateFnResult = col.onUpdateFn?.();
            const value = set[colName] ?? (is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col));
            const res = sql`${sql.identifier(this.casing.getColumnCasing(col))} = ${value}`;
            if (i < setSize - 1) {
              return [res, sql.raw(", ")];
            }
            return [res];
          })
        );
      }
      buildUpdateQuery({
        table,
        set,
        where,
        returning,
        withList,
        joins,
        from,
        limit,
        orderBy
      }) {
        const withSql = this.buildWithCTE(withList);
        const setSql = this.buildUpdateSet(table, set);
        const fromSql = from && sql.join([sql.raw(" from "), this.buildFromTable(from)]);
        const joinsSql = this.buildJoins(joins);
        const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
        const whereSql = where ? sql` where ${where}` : void 0;
        const orderBySql = this.buildOrderBy(orderBy);
        const limitSql = this.buildLimit(limit);
        return sql`${withSql}update ${table} set ${setSql}${fromSql}${joinsSql}${whereSql}${returningSql}${orderBySql}${limitSql}`;
      }
      /**
       * Builds selection SQL with provided fields/expressions
       *
       * Examples:
       *
       * `select <selection> from`
       *
       * `insert ... returning <selection>`
       *
       * If `isSingleTable` is true, then columns won't be prefixed with table name
       */
      buildSelection(fields, { isSingleTable = false } = {}) {
        const columnsLen = fields.length;
        const chunks = fields.flatMap(({ field }, i) => {
          const chunk = [];
          if (is(field, SQL.Aliased) && field.isSelectionField) {
            chunk.push(sql.identifier(field.fieldAlias));
          } else if (is(field, SQL.Aliased) || is(field, SQL)) {
            const query = is(field, SQL.Aliased) ? field.sql : field;
            if (isSingleTable) {
              chunk.push(
                new SQL(
                  query.queryChunks.map((c) => {
                    if (is(c, Column)) {
                      return sql.identifier(this.casing.getColumnCasing(c));
                    }
                    return c;
                  })
                )
              );
            } else {
              chunk.push(query);
            }
            if (is(field, SQL.Aliased)) {
              chunk.push(sql` as ${sql.identifier(field.fieldAlias)}`);
            }
          } else if (is(field, Column)) {
            const tableName = field.table[Table.Symbol.Name];
            if (field.columnType === "SQLiteNumericBigInt") {
              if (isSingleTable) {
                chunk.push(
                  sql`cast(${sql.identifier(this.casing.getColumnCasing(field))} as text)`
                );
              } else {
                chunk.push(
                  sql`cast(${sql.identifier(tableName)}.${sql.identifier(this.casing.getColumnCasing(field))} as text)`
                );
              }
            } else {
              if (isSingleTable) {
                chunk.push(sql.identifier(this.casing.getColumnCasing(field)));
              } else {
                chunk.push(
                  sql`${sql.identifier(tableName)}.${sql.identifier(this.casing.getColumnCasing(field))}`
                );
              }
            }
          } else if (is(field, Subquery)) {
            const entries = Object.entries(field._.selectedFields);
            if (entries.length === 1) {
              const entry = entries[0][1];
              const fieldDecoder = is(entry, SQL) ? entry.decoder : is(entry, Column) ? { mapFromDriverValue: (v) => entry.mapFromDriverValue(v) } : entry.sql.decoder;
              if (fieldDecoder)
                field._.sql.decoder = fieldDecoder;
            }
            chunk.push(field);
          }
          if (i < columnsLen - 1) {
            chunk.push(sql`, `);
          }
          return chunk;
        });
        return sql.join(chunks);
      }
      buildJoins(joins) {
        if (!joins || joins.length === 0) {
          return void 0;
        }
        const joinsArray = [];
        if (joins) {
          for (const [index, joinMeta] of joins.entries()) {
            if (index === 0) {
              joinsArray.push(sql` `);
            }
            const table = joinMeta.table;
            const onSql = joinMeta.on ? sql` on ${joinMeta.on}` : void 0;
            if (is(table, SQLiteTable)) {
              const tableName = table[SQLiteTable.Symbol.Name];
              const tableSchema = table[SQLiteTable.Symbol.Schema];
              const origTableName = table[SQLiteTable.Symbol.OriginalName];
              const alias = tableName === origTableName ? void 0 : joinMeta.alias;
              joinsArray.push(
                sql`${sql.raw(joinMeta.joinType)} join ${tableSchema ? sql`${sql.identifier(tableSchema)}.` : void 0}${sql.identifier(
                  origTableName
                )}${alias && sql` ${sql.identifier(alias)}`}${onSql}`
              );
            } else {
              joinsArray.push(
                sql`${sql.raw(joinMeta.joinType)} join ${table}${onSql}`
              );
            }
            if (index < joins.length - 1) {
              joinsArray.push(sql` `);
            }
          }
        }
        return sql.join(joinsArray);
      }
      buildLimit(limit) {
        return typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
      }
      buildOrderBy(orderBy) {
        const orderByList = [];
        if (orderBy) {
          for (const [index, orderByValue] of orderBy.entries()) {
            orderByList.push(orderByValue);
            if (index < orderBy.length - 1) {
              orderByList.push(sql`, `);
            }
          }
        }
        return orderByList.length > 0 ? sql` order by ${sql.join(orderByList)}` : void 0;
      }
      buildFromTable(table) {
        if (is(table, Table) && table[Table.Symbol.IsAlias]) {
          return sql`${sql`${sql.identifier(table[Table.Symbol.Schema] ?? "")}.`.if(table[Table.Symbol.Schema])}${sql.identifier(
            table[Table.Symbol.OriginalName]
          )} ${sql.identifier(table[Table.Symbol.Name])}`;
        }
        return table;
      }
      buildSelectQuery({
        withList,
        fields,
        fieldsFlat,
        where,
        having,
        table,
        joins,
        orderBy,
        groupBy,
        limit,
        offset,
        distinct,
        setOperators
      }) {
        const fieldsList = fieldsFlat ?? orderSelectedFields(fields);
        for (const f of fieldsList) {
          if (is(f.field, Column) && getTableName(f.field.table) !== (is(table, Subquery) ? table._.alias : is(table, SQLiteViewBase) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : getTableName(table)) && !((table2) => joins?.some(
            ({ alias }) => alias === (table2[Table.Symbol.IsAlias] ? getTableName(table2) : table2[Table.Symbol.BaseName])
          ))(f.field.table)) {
            const tableName = getTableName(f.field.table);
            throw new Error(
              `Your "${f.path.join(
                "->"
              )}" field references a column "${tableName}"."${f.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`
            );
          }
        }
        const isSingleTable = !joins || joins.length === 0;
        const withSql = this.buildWithCTE(withList);
        const distinctSql = distinct ? sql` distinct` : void 0;
        const selection = this.buildSelection(fieldsList, { isSingleTable });
        const tableSql = this.buildFromTable(table);
        const joinsSql = this.buildJoins(joins);
        const whereSql = where ? sql` where ${where}` : void 0;
        const havingSql = having ? sql` having ${having}` : void 0;
        const groupByList = [];
        if (groupBy) {
          for (const [index, groupByValue] of groupBy.entries()) {
            groupByList.push(groupByValue);
            if (index < groupBy.length - 1) {
              groupByList.push(sql`, `);
            }
          }
        }
        const groupBySql = groupByList.length > 0 ? sql` group by ${sql.join(groupByList)}` : void 0;
        const orderBySql = this.buildOrderBy(orderBy);
        const limitSql = this.buildLimit(limit);
        const offsetSql = offset ? sql` offset ${offset}` : void 0;
        const finalQuery = sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}`;
        if (setOperators.length > 0) {
          return this.buildSetOperations(finalQuery, setOperators);
        }
        return finalQuery;
      }
      buildSetOperations(leftSelect, setOperators) {
        const [setOperator, ...rest] = setOperators;
        if (!setOperator) {
          throw new Error("Cannot pass undefined values to any set operator");
        }
        if (rest.length === 0) {
          return this.buildSetOperationQuery({ leftSelect, setOperator });
        }
        return this.buildSetOperations(
          this.buildSetOperationQuery({ leftSelect, setOperator }),
          rest
        );
      }
      buildSetOperationQuery({
        leftSelect,
        setOperator: { type, isAll, rightSelect, limit, orderBy, offset }
      }) {
        const leftChunk = sql`${leftSelect.getSQL()} `;
        const rightChunk = sql`${rightSelect.getSQL()}`;
        let orderBySql;
        if (orderBy && orderBy.length > 0) {
          const orderByValues = [];
          for (const singleOrderBy of orderBy) {
            if (is(singleOrderBy, SQLiteColumn)) {
              orderByValues.push(sql.identifier(singleOrderBy.name));
            } else if (is(singleOrderBy, SQL)) {
              for (let i = 0; i < singleOrderBy.queryChunks.length; i++) {
                const chunk = singleOrderBy.queryChunks[i];
                if (is(chunk, SQLiteColumn)) {
                  singleOrderBy.queryChunks[i] = sql.identifier(
                    this.casing.getColumnCasing(chunk)
                  );
                }
              }
              orderByValues.push(sql`${singleOrderBy}`);
            } else {
              orderByValues.push(sql`${singleOrderBy}`);
            }
          }
          orderBySql = sql` order by ${sql.join(orderByValues, sql`, `)}`;
        }
        const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? sql` limit ${limit}` : void 0;
        const operatorChunk = sql.raw(`${type} ${isAll ? "all " : ""}`);
        const offsetSql = offset ? sql` offset ${offset}` : void 0;
        return sql`${leftChunk}${operatorChunk}${rightChunk}${orderBySql}${limitSql}${offsetSql}`;
      }
      buildInsertQuery({
        table,
        values: valuesOrSelect,
        onConflict,
        returning,
        withList,
        select
      }) {
        const valuesSqlList = [];
        const columns = table[Table.Symbol.Columns];
        const colEntries = Object.entries(columns).filter(
          ([_, col]) => !col.shouldDisableInsert()
        );
        const insertOrder = colEntries.map(([, column]) => sql.identifier(this.casing.getColumnCasing(column)));
        if (select) {
          const select2 = valuesOrSelect;
          if (is(select2, SQL)) {
            valuesSqlList.push(select2);
          } else {
            valuesSqlList.push(select2.getSQL());
          }
        } else {
          const values = valuesOrSelect;
          valuesSqlList.push(sql.raw("values "));
          for (const [valueIndex, value] of values.entries()) {
            const valueList = [];
            for (const [fieldName, col] of colEntries) {
              const colValue = value[fieldName];
              if (colValue === void 0 || is(colValue, Param) && colValue.value === void 0) {
                let defaultValue;
                if (col.default !== null && col.default !== void 0) {
                  defaultValue = is(col.default, SQL) ? col.default : sql.param(col.default, col);
                } else if (col.defaultFn !== void 0) {
                  const defaultFnResult = col.defaultFn();
                  defaultValue = is(defaultFnResult, SQL) ? defaultFnResult : sql.param(defaultFnResult, col);
                } else if (!col.default && col.onUpdateFn !== void 0) {
                  const onUpdateFnResult = col.onUpdateFn();
                  defaultValue = is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col);
                } else {
                  defaultValue = sql`null`;
                }
                valueList.push(defaultValue);
              } else {
                valueList.push(colValue);
              }
            }
            valuesSqlList.push(valueList);
            if (valueIndex < values.length - 1) {
              valuesSqlList.push(sql`, `);
            }
          }
        }
        const withSql = this.buildWithCTE(withList);
        const valuesSql = sql.join(valuesSqlList);
        const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
        const onConflictSql = onConflict?.length ? sql.join(onConflict) : void 0;
        return sql`${withSql}insert into ${table} ${insertOrder} ${valuesSql}${onConflictSql}${returningSql}`;
      }
      sqlToQuery(sql2, invokeSource) {
        return sql2.toQuery({
          casing: this.casing,
          escapeName: this.escapeName,
          escapeParam: this.escapeParam,
          escapeString: this.escapeString,
          invokeSource
        });
      }
      buildRelationalQuery({
        fullSchema,
        schema,
        tableNamesMap,
        table,
        tableConfig,
        queryConfig: config,
        tableAlias,
        nestedQueryRelation,
        joinOn
      }) {
        let selection = [];
        let limit, offset, orderBy = [], where;
        const joins = [];
        if (config === true) {
          const selectionEntries = Object.entries(tableConfig.columns);
          selection = selectionEntries.map(([key, value]) => ({
            dbKey: value.name,
            tsKey: key,
            field: aliasedTableColumn(value, tableAlias),
            relationTableTsKey: void 0,
            isJson: false,
            selection: []
          }));
        } else {
          const aliasedColumns = Object.fromEntries(
            Object.entries(tableConfig.columns).map(([key, value]) => [
              key,
              aliasedTableColumn(value, tableAlias)
            ])
          );
          if (config.where) {
            const whereSql = typeof config.where === "function" ? config.where(aliasedColumns, getOperators()) : config.where;
            where = whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
          }
          const fieldsSelection = [];
          let selectedColumns = [];
          if (config.columns) {
            let isIncludeMode = false;
            for (const [field, value] of Object.entries(config.columns)) {
              if (value === void 0) {
                continue;
              }
              if (field in tableConfig.columns) {
                if (!isIncludeMode && value === true) {
                  isIncludeMode = true;
                }
                selectedColumns.push(field);
              }
            }
            if (selectedColumns.length > 0) {
              selectedColumns = isIncludeMode ? selectedColumns.filter((c) => config.columns?.[c] === true) : Object.keys(tableConfig.columns).filter(
                (key) => !selectedColumns.includes(key)
              );
            }
          } else {
            selectedColumns = Object.keys(tableConfig.columns);
          }
          for (const field of selectedColumns) {
            const column = tableConfig.columns[field];
            fieldsSelection.push({ tsKey: field, value: column });
          }
          let selectedRelations = [];
          if (config.with) {
            selectedRelations = Object.entries(config.with).filter(
              (entry) => !!entry[1]
            ).map(([tsKey, queryConfig]) => ({
              tsKey,
              queryConfig,
              relation: tableConfig.relations[tsKey]
            }));
          }
          let extras;
          if (config.extras) {
            extras = typeof config.extras === "function" ? config.extras(aliasedColumns, { sql }) : config.extras;
            for (const [tsKey, value] of Object.entries(extras)) {
              fieldsSelection.push({
                tsKey,
                value: mapColumnsInAliasedSQLToAlias(value, tableAlias)
              });
            }
          }
          for (const { tsKey, value } of fieldsSelection) {
            selection.push({
              dbKey: is(value, SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey].name,
              tsKey,
              field: is(value, Column) ? aliasedTableColumn(value, tableAlias) : value,
              relationTableTsKey: void 0,
              isJson: false,
              selection: []
            });
          }
          let orderByOrig = typeof config.orderBy === "function" ? config.orderBy(aliasedColumns, getOrderByOperators()) : config.orderBy ?? [];
          if (!Array.isArray(orderByOrig)) {
            orderByOrig = [orderByOrig];
          }
          orderBy = orderByOrig.map((orderByValue) => {
            if (is(orderByValue, Column)) {
              return aliasedTableColumn(orderByValue, tableAlias);
            }
            return mapColumnsInSQLToAlias(orderByValue, tableAlias);
          });
          limit = config.limit;
          offset = config.offset;
          for (const {
            tsKey: selectedRelationTsKey,
            queryConfig: selectedRelationConfigValue,
            relation
          } of selectedRelations) {
            const normalizedRelation = normalizeRelation(
              schema,
              tableNamesMap,
              relation
            );
            const relationTableName = getTableUniqueName(relation.referencedTable);
            const relationTableTsName = tableNamesMap[relationTableName];
            const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
            const joinOn2 = and(
              ...normalizedRelation.fields.map(
                (field2, i) => eq(
                  aliasedTableColumn(
                    normalizedRelation.references[i],
                    relationTableAlias
                  ),
                  aliasedTableColumn(field2, tableAlias)
                )
              )
            );
            const builtRelation = this.buildRelationalQuery({
              fullSchema,
              schema,
              tableNamesMap,
              table: fullSchema[relationTableTsName],
              tableConfig: schema[relationTableTsName],
              queryConfig: is(relation, One) ? selectedRelationConfigValue === true ? { limit: 1 } : { ...selectedRelationConfigValue, limit: 1 } : selectedRelationConfigValue,
              tableAlias: relationTableAlias,
              joinOn: joinOn2,
              nestedQueryRelation: relation
            });
            const field = sql`(${builtRelation.sql})`.as(selectedRelationTsKey);
            selection.push({
              dbKey: selectedRelationTsKey,
              tsKey: selectedRelationTsKey,
              field,
              relationTableTsKey: relationTableTsName,
              isJson: true,
              selection: builtRelation.selection
            });
          }
        }
        if (selection.length === 0) {
          throw new DrizzleError({
            message: `No fields selected for table "${tableConfig.tsName}" ("${tableAlias}"). You need to have at least one item in "columns", "with" or "extras". If you need to select all columns, omit the "columns" key or set it to undefined.`
          });
        }
        let result;
        where = and(joinOn, where);
        if (nestedQueryRelation) {
          let field = sql`json_array(${sql.join(
            selection.map(
              ({ field: field2 }) => is(field2, SQLiteColumn) ? sql.identifier(this.casing.getColumnCasing(field2)) : is(field2, SQL.Aliased) ? field2.sql : field2
            ),
            sql`, `
          )})`;
          if (is(nestedQueryRelation, Many)) {
            field = sql`coalesce(json_group_array(${field}), json_array())`;
          }
          const nestedSelection = [
            {
              dbKey: "data",
              tsKey: "data",
              field: field.as("data"),
              isJson: true,
              relationTableTsKey: tableConfig.tsName,
              selection
            }
          ];
          const needsSubquery = limit !== void 0 || offset !== void 0 || orderBy.length > 0;
          if (needsSubquery) {
            result = this.buildSelectQuery({
              table: aliasedTable(table, tableAlias),
              fields: {},
              fieldsFlat: [
                {
                  path: [],
                  field: sql.raw("*")
                }
              ],
              where,
              limit,
              offset,
              orderBy,
              setOperators: []
            });
            where = void 0;
            limit = void 0;
            offset = void 0;
            orderBy = void 0;
          } else {
            result = aliasedTable(table, tableAlias);
          }
          result = this.buildSelectQuery({
            table: is(result, SQLiteTable) ? result : new Subquery(result, {}, tableAlias),
            fields: {},
            fieldsFlat: nestedSelection.map(({ field: field2 }) => ({
              path: [],
              field: is(field2, Column) ? aliasedTableColumn(field2, tableAlias) : field2
            })),
            joins,
            where,
            limit,
            offset,
            orderBy,
            setOperators: []
          });
        } else {
          result = this.buildSelectQuery({
            table: aliasedTable(table, tableAlias),
            fields: {},
            fieldsFlat: selection.map(({ field }) => ({
              path: [],
              field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field
            })),
            joins,
            where,
            limit,
            offset,
            orderBy,
            setOperators: []
          });
        }
        return {
          tableTsKey: tableConfig.tsName,
          sql: result,
          selection
        };
      }
    };
    SQLiteSyncDialect = class extends SQLiteDialect {
      static [entityKind] = "SQLiteSyncDialect";
      migrate(migrations, session, config) {
        const migrationsTable = config === void 0 ? "__drizzle_migrations" : typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
        const migrationTableCreate = sql`
			CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
        session.run(migrationTableCreate);
        const dbMigrations = session.values(
          sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
        );
        const lastDbMigration = dbMigrations[0] ?? void 0;
        session.run(sql`BEGIN`);
        try {
          for (const migration of migrations) {
            if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
              for (const stmt of migration.sql) {
                session.run(sql.raw(stmt));
              }
              session.run(
                sql`INSERT INTO ${sql.identifier(
                  migrationsTable
                )} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`
              );
            }
          }
          session.run(sql`COMMIT`);
        } catch (e) {
          session.run(sql`ROLLBACK`);
          throw e;
        }
      }
    };
    SQLiteAsyncDialect = class extends SQLiteDialect {
      static [entityKind] = "SQLiteAsyncDialect";
      async migrate(migrations, session, config) {
        const migrationsTable = config === void 0 ? "__drizzle_migrations" : typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
        const migrationTableCreate = sql`
			CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
        await session.run(migrationTableCreate);
        const dbMigrations = await session.values(
          sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
        );
        const lastDbMigration = dbMigrations[0] ?? void 0;
        await session.transaction(async (tx) => {
          for (const migration of migrations) {
            if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
              for (const stmt of migration.sql) {
                await tx.run(sql.raw(stmt));
              }
              await tx.run(
                sql`INSERT INTO ${sql.identifier(
                  migrationsTable
                )} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`
              );
            }
          }
        });
      }
    };
  }
});

// node_modules/drizzle-orm/query-builders/query-builder.js
var TypedQueryBuilder;
var init_query_builder = __esm({
  "node_modules/drizzle-orm/query-builders/query-builder.js"() {
    init_entity();
    TypedQueryBuilder = class {
      static [entityKind] = "TypedQueryBuilder";
      /** @internal */
      getSelectedFields() {
        return this._.selectedFields;
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/query-builders/select.js
function createSetOperator(type, isAll) {
  return (leftSelect, rightSelect, ...restSelects) => {
    const setOperators = [rightSelect, ...restSelects].map((select) => ({
      type,
      isAll,
      rightSelect: select
    }));
    for (const setOperator of setOperators) {
      if (!haveSameKeys(leftSelect.getSelectedFields(), setOperator.rightSelect.getSelectedFields())) {
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      }
    }
    return leftSelect.addSetOperators(setOperators);
  };
}
var SQLiteSelectBuilder, SQLiteSelectQueryBuilderBase, SQLiteSelectBase, getSQLiteSetOperators, union, unionAll, intersect, except;
var init_select2 = __esm({
  "node_modules/drizzle-orm/sqlite-core/query-builders/select.js"() {
    init_entity();
    init_query_builder();
    init_query_promise();
    init_selection_proxy();
    init_sql();
    init_subquery();
    init_table();
    init_utils();
    init_view_common();
    init_utils2();
    init_view_base();
    SQLiteSelectBuilder = class {
      static [entityKind] = "SQLiteSelectBuilder";
      fields;
      session;
      dialect;
      withList;
      distinct;
      constructor(config) {
        this.fields = config.fields;
        this.session = config.session;
        this.dialect = config.dialect;
        this.withList = config.withList;
        this.distinct = config.distinct;
      }
      from(source) {
        const isPartialSelect = !!this.fields;
        let fields;
        if (this.fields) {
          fields = this.fields;
        } else if (is(source, Subquery)) {
          fields = Object.fromEntries(
            Object.keys(source._.selectedFields).map((key) => [key, source[key]])
          );
        } else if (is(source, SQLiteViewBase)) {
          fields = source[ViewBaseConfig].selectedFields;
        } else if (is(source, SQL)) {
          fields = {};
        } else {
          fields = getTableColumns(source);
        }
        return new SQLiteSelectBase({
          table: source,
          fields,
          isPartialSelect,
          session: this.session,
          dialect: this.dialect,
          withList: this.withList,
          distinct: this.distinct
        });
      }
    };
    SQLiteSelectQueryBuilderBase = class extends TypedQueryBuilder {
      static [entityKind] = "SQLiteSelectQueryBuilder";
      _;
      /** @internal */
      config;
      joinsNotNullableMap;
      tableName;
      isPartialSelect;
      session;
      dialect;
      cacheConfig = void 0;
      usedTables = /* @__PURE__ */ new Set();
      constructor({ table, fields, isPartialSelect, session, dialect, withList, distinct }) {
        super();
        this.config = {
          withList,
          table,
          fields: { ...fields },
          distinct,
          setOperators: []
        };
        this.isPartialSelect = isPartialSelect;
        this.session = session;
        this.dialect = dialect;
        this._ = {
          selectedFields: fields,
          config: this.config
        };
        this.tableName = getTableLikeName(table);
        this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
        for (const item of extractUsedTable(table))
          this.usedTables.add(item);
      }
      /** @internal */
      getUsedTables() {
        return [...this.usedTables];
      }
      createJoin(joinType) {
        return (table, on) => {
          const baseTableName = this.tableName;
          const tableName = getTableLikeName(table);
          for (const item of extractUsedTable(table))
            this.usedTables.add(item);
          if (typeof tableName === "string" && this.config.joins?.some((join3) => join3.alias === tableName)) {
            throw new Error(`Alias "${tableName}" is already used in this query`);
          }
          if (!this.isPartialSelect) {
            if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string") {
              this.config.fields = {
                [baseTableName]: this.config.fields
              };
            }
            if (typeof tableName === "string" && !is(table, SQL)) {
              const selection = is(table, Subquery) ? table._.selectedFields : is(table, View) ? table[ViewBaseConfig].selectedFields : table[Table.Symbol.Columns];
              this.config.fields[tableName] = selection;
            }
          }
          if (typeof on === "function") {
            on = on(
              new Proxy(
                this.config.fields,
                new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
              )
            );
          }
          if (!this.config.joins) {
            this.config.joins = [];
          }
          this.config.joins.push({ on, table, joinType, alias: tableName });
          if (typeof tableName === "string") {
            switch (joinType) {
              case "left": {
                this.joinsNotNullableMap[tableName] = false;
                break;
              }
              case "right": {
                this.joinsNotNullableMap = Object.fromEntries(
                  Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
                );
                this.joinsNotNullableMap[tableName] = true;
                break;
              }
              case "cross":
              case "inner": {
                this.joinsNotNullableMap[tableName] = true;
                break;
              }
              case "full": {
                this.joinsNotNullableMap = Object.fromEntries(
                  Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
                );
                this.joinsNotNullableMap[tableName] = false;
                break;
              }
            }
          }
          return this;
        };
      }
      /**
       * Executes a `left join` operation by adding another table to the current query.
       *
       * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
       *
       * See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
       *
       * @param table the table to join.
       * @param on the `on` clause.
       *
       * @example
       *
       * ```ts
       * // Select all users and their pets
       * const usersWithPets: { user: User; pets: Pet | null; }[] = await db.select()
       *   .from(users)
       *   .leftJoin(pets, eq(users.id, pets.ownerId))
       *
       * // Select userId and petId
       * const usersIdsAndPetIds: { userId: number; petId: number | null; }[] = await db.select({
       *   userId: users.id,
       *   petId: pets.id,
       * })
       *   .from(users)
       *   .leftJoin(pets, eq(users.id, pets.ownerId))
       * ```
       */
      leftJoin = this.createJoin("left");
      /**
       * Executes a `right join` operation by adding another table to the current query.
       *
       * Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
       *
       * See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
       *
       * @param table the table to join.
       * @param on the `on` clause.
       *
       * @example
       *
       * ```ts
       * // Select all users and their pets
       * const usersWithPets: { user: User | null; pets: Pet; }[] = await db.select()
       *   .from(users)
       *   .rightJoin(pets, eq(users.id, pets.ownerId))
       *
       * // Select userId and petId
       * const usersIdsAndPetIds: { userId: number | null; petId: number; }[] = await db.select({
       *   userId: users.id,
       *   petId: pets.id,
       * })
       *   .from(users)
       *   .rightJoin(pets, eq(users.id, pets.ownerId))
       * ```
       */
      rightJoin = this.createJoin("right");
      /**
       * Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
       *
       * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
       *
       * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
       *
       * @param table the table to join.
       * @param on the `on` clause.
       *
       * @example
       *
       * ```ts
       * // Select all users and their pets
       * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
       *   .from(users)
       *   .innerJoin(pets, eq(users.id, pets.ownerId))
       *
       * // Select userId and petId
       * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
       *   userId: users.id,
       *   petId: pets.id,
       * })
       *   .from(users)
       *   .innerJoin(pets, eq(users.id, pets.ownerId))
       * ```
       */
      innerJoin = this.createJoin("inner");
      /**
       * Executes a `full join` operation by combining rows from two tables into a new table.
       *
       * Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
       *
       * See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
       *
       * @param table the table to join.
       * @param on the `on` clause.
       *
       * @example
       *
       * ```ts
       * // Select all users and their pets
       * const usersWithPets: { user: User | null; pets: Pet | null; }[] = await db.select()
       *   .from(users)
       *   .fullJoin(pets, eq(users.id, pets.ownerId))
       *
       * // Select userId and petId
       * const usersIdsAndPetIds: { userId: number | null; petId: number | null; }[] = await db.select({
       *   userId: users.id,
       *   petId: pets.id,
       * })
       *   .from(users)
       *   .fullJoin(pets, eq(users.id, pets.ownerId))
       * ```
       */
      fullJoin = this.createJoin("full");
      /**
       * Executes a `cross join` operation by combining rows from two tables into a new table.
       *
       * Calling this method retrieves all rows from both main and joined tables, merging all rows from each table.
       *
       * See docs: {@link https://orm.drizzle.team/docs/joins#cross-join}
       *
       * @param table the table to join.
       *
       * @example
       *
       * ```ts
       * // Select all users, each user with every pet
       * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
       *   .from(users)
       *   .crossJoin(pets)
       *
       * // Select userId and petId
       * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
       *   userId: users.id,
       *   petId: pets.id,
       * })
       *   .from(users)
       *   .crossJoin(pets)
       * ```
       */
      crossJoin = this.createJoin("cross");
      createSetOperator(type, isAll) {
        return (rightSelection) => {
          const rightSelect = typeof rightSelection === "function" ? rightSelection(getSQLiteSetOperators()) : rightSelection;
          if (!haveSameKeys(this.getSelectedFields(), rightSelect.getSelectedFields())) {
            throw new Error(
              "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
            );
          }
          this.config.setOperators.push({ type, isAll, rightSelect });
          return this;
        };
      }
      /**
       * Adds `union` set operator to the query.
       *
       * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
       *
       * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
       *
       * @example
       *
       * ```ts
       * // Select all unique names from customers and users tables
       * await db.select({ name: users.name })
       *   .from(users)
       *   .union(
       *     db.select({ name: customers.name }).from(customers)
       *   );
       * // or
       * import { union } from 'drizzle-orm/sqlite-core'
       *
       * await union(
       *   db.select({ name: users.name }).from(users),
       *   db.select({ name: customers.name }).from(customers)
       * );
       * ```
       */
      union = this.createSetOperator("union", false);
      /**
       * Adds `union all` set operator to the query.
       *
       * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
       *
       * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
       *
       * @example
       *
       * ```ts
       * // Select all transaction ids from both online and in-store sales
       * await db.select({ transaction: onlineSales.transactionId })
       *   .from(onlineSales)
       *   .unionAll(
       *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
       *   );
       * // or
       * import { unionAll } from 'drizzle-orm/sqlite-core'
       *
       * await unionAll(
       *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
       *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
       * );
       * ```
       */
      unionAll = this.createSetOperator("union", true);
      /**
       * Adds `intersect` set operator to the query.
       *
       * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
       *
       * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
       *
       * @example
       *
       * ```ts
       * // Select course names that are offered in both departments A and B
       * await db.select({ courseName: depA.courseName })
       *   .from(depA)
       *   .intersect(
       *     db.select({ courseName: depB.courseName }).from(depB)
       *   );
       * // or
       * import { intersect } from 'drizzle-orm/sqlite-core'
       *
       * await intersect(
       *   db.select({ courseName: depA.courseName }).from(depA),
       *   db.select({ courseName: depB.courseName }).from(depB)
       * );
       * ```
       */
      intersect = this.createSetOperator("intersect", false);
      /**
       * Adds `except` set operator to the query.
       *
       * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
       *
       * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
       *
       * @example
       *
       * ```ts
       * // Select all courses offered in department A but not in department B
       * await db.select({ courseName: depA.courseName })
       *   .from(depA)
       *   .except(
       *     db.select({ courseName: depB.courseName }).from(depB)
       *   );
       * // or
       * import { except } from 'drizzle-orm/sqlite-core'
       *
       * await except(
       *   db.select({ courseName: depA.courseName }).from(depA),
       *   db.select({ courseName: depB.courseName }).from(depB)
       * );
       * ```
       */
      except = this.createSetOperator("except", false);
      /** @internal */
      addSetOperators(setOperators) {
        this.config.setOperators.push(...setOperators);
        return this;
      }
      /**
       * Adds a `where` clause to the query.
       *
       * Calling this method will select only those rows that fulfill a specified condition.
       *
       * See docs: {@link https://orm.drizzle.team/docs/select#filtering}
       *
       * @param where the `where` clause.
       *
       * @example
       * You can use conditional operators and `sql function` to filter the rows to be selected.
       *
       * ```ts
       * // Select all cars with green color
       * await db.select().from(cars).where(eq(cars.color, 'green'));
       * // or
       * await db.select().from(cars).where(sql`${cars.color} = 'green'`)
       * ```
       *
       * You can logically combine conditional operators with `and()` and `or()` operators:
       *
       * ```ts
       * // Select all BMW cars with a green color
       * await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
       *
       * // Select all cars with the green or blue color
       * await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
       * ```
       */
      where(where) {
        if (typeof where === "function") {
          where = where(
            new Proxy(
              this.config.fields,
              new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
            )
          );
        }
        this.config.where = where;
        return this;
      }
      /**
       * Adds a `having` clause to the query.
       *
       * Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
       *
       * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
       *
       * @param having the `having` clause.
       *
       * @example
       *
       * ```ts
       * // Select all brands with more than one car
       * await db.select({
       * 	brand: cars.brand,
       * 	count: sql<number>`cast(count(${cars.id}) as int)`,
       * })
       *   .from(cars)
       *   .groupBy(cars.brand)
       *   .having(({ count }) => gt(count, 1));
       * ```
       */
      having(having) {
        if (typeof having === "function") {
          having = having(
            new Proxy(
              this.config.fields,
              new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
            )
          );
        }
        this.config.having = having;
        return this;
      }
      groupBy(...columns) {
        if (typeof columns[0] === "function") {
          const groupBy = columns[0](
            new Proxy(
              this.config.fields,
              new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
            )
          );
          this.config.groupBy = Array.isArray(groupBy) ? groupBy : [groupBy];
        } else {
          this.config.groupBy = columns;
        }
        return this;
      }
      orderBy(...columns) {
        if (typeof columns[0] === "function") {
          const orderBy = columns[0](
            new Proxy(
              this.config.fields,
              new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
            )
          );
          const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
          if (this.config.setOperators.length > 0) {
            this.config.setOperators.at(-1).orderBy = orderByArray;
          } else {
            this.config.orderBy = orderByArray;
          }
        } else {
          const orderByArray = columns;
          if (this.config.setOperators.length > 0) {
            this.config.setOperators.at(-1).orderBy = orderByArray;
          } else {
            this.config.orderBy = orderByArray;
          }
        }
        return this;
      }
      /**
       * Adds a `limit` clause to the query.
       *
       * Calling this method will set the maximum number of rows that will be returned by this query.
       *
       * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
       *
       * @param limit the `limit` clause.
       *
       * @example
       *
       * ```ts
       * // Get the first 10 people from this query.
       * await db.select().from(people).limit(10);
       * ```
       */
      limit(limit) {
        if (this.config.setOperators.length > 0) {
          this.config.setOperators.at(-1).limit = limit;
        } else {
          this.config.limit = limit;
        }
        return this;
      }
      /**
       * Adds an `offset` clause to the query.
       *
       * Calling this method will skip a number of rows when returning results from this query.
       *
       * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
       *
       * @param offset the `offset` clause.
       *
       * @example
       *
       * ```ts
       * // Get the 10th-20th people from this query.
       * await db.select().from(people).offset(10).limit(10);
       * ```
       */
      offset(offset) {
        if (this.config.setOperators.length > 0) {
          this.config.setOperators.at(-1).offset = offset;
        } else {
          this.config.offset = offset;
        }
        return this;
      }
      /** @internal */
      getSQL() {
        return this.dialect.buildSelectQuery(this.config);
      }
      toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
        return rest;
      }
      as(alias) {
        const usedTables = [];
        usedTables.push(...extractUsedTable(this.config.table));
        if (this.config.joins) {
          for (const it of this.config.joins)
            usedTables.push(...extractUsedTable(it.table));
        }
        return new Proxy(
          new Subquery(this.getSQL(), this.config.fields, alias, false, [...new Set(usedTables)]),
          new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
        );
      }
      /** @internal */
      getSelectedFields() {
        return new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
        );
      }
      $dynamic() {
        return this;
      }
    };
    SQLiteSelectBase = class extends SQLiteSelectQueryBuilderBase {
      static [entityKind] = "SQLiteSelect";
      /** @internal */
      _prepare(isOneTimeQuery = true) {
        if (!this.session) {
          throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
        }
        const fieldsList = orderSelectedFields(this.config.fields);
        const query = this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
          this.dialect.sqlToQuery(this.getSQL()),
          fieldsList,
          "all",
          true,
          void 0,
          {
            type: "select",
            tables: [...this.usedTables]
          },
          this.cacheConfig
        );
        query.joinsNotNullableMap = this.joinsNotNullableMap;
        return query;
      }
      $withCache(config) {
        this.cacheConfig = config === void 0 ? { config: {}, enable: true, autoInvalidate: true } : config === false ? { enable: false } : { enable: true, autoInvalidate: true, ...config };
        return this;
      }
      prepare() {
        return this._prepare(false);
      }
      run = (placeholderValues) => {
        return this._prepare().run(placeholderValues);
      };
      all = (placeholderValues) => {
        return this._prepare().all(placeholderValues);
      };
      get = (placeholderValues) => {
        return this._prepare().get(placeholderValues);
      };
      values = (placeholderValues) => {
        return this._prepare().values(placeholderValues);
      };
      async execute() {
        return this.all();
      }
    };
    applyMixins(SQLiteSelectBase, [QueryPromise]);
    getSQLiteSetOperators = () => ({
      union,
      unionAll,
      intersect,
      except
    });
    union = createSetOperator("union", false);
    unionAll = createSetOperator("union", true);
    intersect = createSetOperator("intersect", false);
    except = createSetOperator("except", false);
  }
});

// node_modules/drizzle-orm/sqlite-core/query-builders/query-builder.js
var QueryBuilder;
var init_query_builder2 = __esm({
  "node_modules/drizzle-orm/sqlite-core/query-builders/query-builder.js"() {
    init_entity();
    init_selection_proxy();
    init_dialect();
    init_subquery();
    init_select2();
    QueryBuilder = class {
      static [entityKind] = "SQLiteQueryBuilder";
      dialect;
      dialectConfig;
      constructor(dialect) {
        this.dialect = is(dialect, SQLiteDialect) ? dialect : void 0;
        this.dialectConfig = is(dialect, SQLiteDialect) ? void 0 : dialect;
      }
      $with = (alias, selection) => {
        const queryBuilder = this;
        const as = (qb) => {
          if (typeof qb === "function") {
            qb = qb(queryBuilder);
          }
          return new Proxy(
            new WithSubquery(
              qb.getSQL(),
              selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}),
              alias,
              true
            ),
            new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
          );
        };
        return { as };
      };
      with(...queries) {
        const self = this;
        function select(fields) {
          return new SQLiteSelectBuilder({
            fields: fields ?? void 0,
            session: void 0,
            dialect: self.getDialect(),
            withList: queries
          });
        }
        function selectDistinct(fields) {
          return new SQLiteSelectBuilder({
            fields: fields ?? void 0,
            session: void 0,
            dialect: self.getDialect(),
            withList: queries,
            distinct: true
          });
        }
        return { select, selectDistinct };
      }
      select(fields) {
        return new SQLiteSelectBuilder({ fields: fields ?? void 0, session: void 0, dialect: this.getDialect() });
      }
      selectDistinct(fields) {
        return new SQLiteSelectBuilder({
          fields: fields ?? void 0,
          session: void 0,
          dialect: this.getDialect(),
          distinct: true
        });
      }
      // Lazy load dialect to avoid circular dependency
      getDialect() {
        if (!this.dialect) {
          this.dialect = new SQLiteSyncDialect(this.dialectConfig);
        }
        return this.dialect;
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/query-builders/insert.js
var SQLiteInsertBuilder, SQLiteInsertBase;
var init_insert = __esm({
  "node_modules/drizzle-orm/sqlite-core/query-builders/insert.js"() {
    init_entity();
    init_query_promise();
    init_sql();
    init_table3();
    init_table();
    init_utils();
    init_utils2();
    init_query_builder2();
    SQLiteInsertBuilder = class {
      constructor(table, session, dialect, withList) {
        this.table = table;
        this.session = session;
        this.dialect = dialect;
        this.withList = withList;
      }
      static [entityKind] = "SQLiteInsertBuilder";
      values(values) {
        values = Array.isArray(values) ? values : [values];
        if (values.length === 0) {
          throw new Error("values() must be called with at least one value");
        }
        const mappedValues = values.map((entry) => {
          const result = {};
          const cols = this.table[Table.Symbol.Columns];
          for (const colKey of Object.keys(entry)) {
            const colValue = entry[colKey];
            result[colKey] = is(colValue, SQL) ? colValue : new Param(colValue, cols[colKey]);
          }
          return result;
        });
        return new SQLiteInsertBase(this.table, mappedValues, this.session, this.dialect, this.withList);
      }
      select(selectQuery) {
        const select = typeof selectQuery === "function" ? selectQuery(new QueryBuilder()) : selectQuery;
        if (!is(select, SQL) && !haveSameKeys(this.table[Columns], select._.selectedFields)) {
          throw new Error(
            "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
          );
        }
        return new SQLiteInsertBase(this.table, select, this.session, this.dialect, this.withList, true);
      }
    };
    SQLiteInsertBase = class extends QueryPromise {
      constructor(table, values, session, dialect, withList, select) {
        super();
        this.session = session;
        this.dialect = dialect;
        this.config = { table, values, withList, select };
      }
      static [entityKind] = "SQLiteInsert";
      /** @internal */
      config;
      returning(fields = this.config.table[SQLiteTable.Symbol.Columns]) {
        this.config.returning = orderSelectedFields(fields);
        return this;
      }
      /**
       * Adds an `on conflict do nothing` clause to the query.
       *
       * Calling this method simply avoids inserting a row as its alternative action.
       *
       * See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
       *
       * @param config The `target` and `where` clauses.
       *
       * @example
       * ```ts
       * // Insert one row and cancel the insert if there's a conflict
       * await db.insert(cars)
       *   .values({ id: 1, brand: 'BMW' })
       *   .onConflictDoNothing();
       *
       * // Explicitly specify conflict target
       * await db.insert(cars)
       *   .values({ id: 1, brand: 'BMW' })
       *   .onConflictDoNothing({ target: cars.id });
       * ```
       */
      onConflictDoNothing(config = {}) {
        if (!this.config.onConflict)
          this.config.onConflict = [];
        if (config.target === void 0) {
          this.config.onConflict.push(sql` on conflict do nothing`);
        } else {
          const targetSql = Array.isArray(config.target) ? sql`${config.target}` : sql`${[config.target]}`;
          const whereSql = config.where ? sql` where ${config.where}` : sql``;
          this.config.onConflict.push(sql` on conflict ${targetSql} do nothing${whereSql}`);
        }
        return this;
      }
      /**
       * Adds an `on conflict do update` clause to the query.
       *
       * Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
       *
       * See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
       *
       * @param config The `target`, `set` and `where` clauses.
       *
       * @example
       * ```ts
       * // Update the row if there's a conflict
       * await db.insert(cars)
       *   .values({ id: 1, brand: 'BMW' })
       *   .onConflictDoUpdate({
       *     target: cars.id,
       *     set: { brand: 'Porsche' }
       *   });
       *
       * // Upsert with 'where' clause
       * await db.insert(cars)
       *   .values({ id: 1, brand: 'BMW' })
       *   .onConflictDoUpdate({
       *     target: cars.id,
       *     set: { brand: 'newBMW' },
       *     where: sql`${cars.createdAt} > '2023-01-01'::date`,
       *   });
       * ```
       */
      onConflictDoUpdate(config) {
        if (config.where && (config.targetWhere || config.setWhere)) {
          throw new Error(
            'You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.'
          );
        }
        if (!this.config.onConflict)
          this.config.onConflict = [];
        const whereSql = config.where ? sql` where ${config.where}` : void 0;
        const targetWhereSql = config.targetWhere ? sql` where ${config.targetWhere}` : void 0;
        const setWhereSql = config.setWhere ? sql` where ${config.setWhere}` : void 0;
        const targetSql = Array.isArray(config.target) ? sql`${config.target}` : sql`${[config.target]}`;
        const setSql = this.dialect.buildUpdateSet(this.config.table, mapUpdateSet(this.config.table, config.set));
        this.config.onConflict.push(
          sql` on conflict ${targetSql}${targetWhereSql} do update set ${setSql}${whereSql}${setWhereSql}`
        );
        return this;
      }
      /** @internal */
      getSQL() {
        return this.dialect.buildInsertQuery(this.config);
      }
      toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
        return rest;
      }
      /** @internal */
      _prepare(isOneTimeQuery = true) {
        return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
          this.dialect.sqlToQuery(this.getSQL()),
          this.config.returning,
          this.config.returning ? "all" : "run",
          true,
          void 0,
          {
            type: "insert",
            tables: extractUsedTable(this.config.table)
          }
        );
      }
      prepare() {
        return this._prepare(false);
      }
      run = (placeholderValues) => {
        return this._prepare().run(placeholderValues);
      };
      all = (placeholderValues) => {
        return this._prepare().all(placeholderValues);
      };
      get = (placeholderValues) => {
        return this._prepare().get(placeholderValues);
      };
      values = (placeholderValues) => {
        return this._prepare().values(placeholderValues);
      };
      async execute() {
        return this.config.returning ? this.all() : this.run();
      }
      $dynamic() {
        return this;
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/query-builders/select.types.js
var init_select_types = __esm({
  "node_modules/drizzle-orm/sqlite-core/query-builders/select.types.js"() {
  }
});

// node_modules/drizzle-orm/sqlite-core/query-builders/update.js
var SQLiteUpdateBuilder, SQLiteUpdateBase;
var init_update = __esm({
  "node_modules/drizzle-orm/sqlite-core/query-builders/update.js"() {
    init_entity();
    init_query_promise();
    init_selection_proxy();
    init_table3();
    init_subquery();
    init_table();
    init_utils();
    init_view_common();
    init_utils2();
    init_view_base();
    SQLiteUpdateBuilder = class {
      constructor(table, session, dialect, withList) {
        this.table = table;
        this.session = session;
        this.dialect = dialect;
        this.withList = withList;
      }
      static [entityKind] = "SQLiteUpdateBuilder";
      set(values) {
        return new SQLiteUpdateBase(
          this.table,
          mapUpdateSet(this.table, values),
          this.session,
          this.dialect,
          this.withList
        );
      }
    };
    SQLiteUpdateBase = class extends QueryPromise {
      constructor(table, set, session, dialect, withList) {
        super();
        this.session = session;
        this.dialect = dialect;
        this.config = { set, table, withList, joins: [] };
      }
      static [entityKind] = "SQLiteUpdate";
      /** @internal */
      config;
      from(source) {
        this.config.from = source;
        return this;
      }
      createJoin(joinType) {
        return (table, on) => {
          const tableName = getTableLikeName(table);
          if (typeof tableName === "string" && this.config.joins.some((join3) => join3.alias === tableName)) {
            throw new Error(`Alias "${tableName}" is already used in this query`);
          }
          if (typeof on === "function") {
            const from = this.config.from ? is(table, SQLiteTable) ? table[Table.Symbol.Columns] : is(table, Subquery) ? table._.selectedFields : is(table, SQLiteViewBase) ? table[ViewBaseConfig].selectedFields : void 0 : void 0;
            on = on(
              new Proxy(
                this.config.table[Table.Symbol.Columns],
                new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
              ),
              from && new Proxy(
                from,
                new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
              )
            );
          }
          this.config.joins.push({ on, table, joinType, alias: tableName });
          return this;
        };
      }
      leftJoin = this.createJoin("left");
      rightJoin = this.createJoin("right");
      innerJoin = this.createJoin("inner");
      fullJoin = this.createJoin("full");
      /**
       * Adds a 'where' clause to the query.
       *
       * Calling this method will update only those rows that fulfill a specified condition.
       *
       * See docs: {@link https://orm.drizzle.team/docs/update}
       *
       * @param where the 'where' clause.
       *
       * @example
       * You can use conditional operators and `sql function` to filter the rows to be updated.
       *
       * ```ts
       * // Update all cars with green color
       * db.update(cars).set({ color: 'red' })
       *   .where(eq(cars.color, 'green'));
       * // or
       * db.update(cars).set({ color: 'red' })
       *   .where(sql`${cars.color} = 'green'`)
       * ```
       *
       * You can logically combine conditional operators with `and()` and `or()` operators:
       *
       * ```ts
       * // Update all BMW cars with a green color
       * db.update(cars).set({ color: 'red' })
       *   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
       *
       * // Update all cars with the green or blue color
       * db.update(cars).set({ color: 'red' })
       *   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
       * ```
       */
      where(where) {
        this.config.where = where;
        return this;
      }
      orderBy(...columns) {
        if (typeof columns[0] === "function") {
          const orderBy = columns[0](
            new Proxy(
              this.config.table[Table.Symbol.Columns],
              new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
            )
          );
          const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
          this.config.orderBy = orderByArray;
        } else {
          const orderByArray = columns;
          this.config.orderBy = orderByArray;
        }
        return this;
      }
      limit(limit) {
        this.config.limit = limit;
        return this;
      }
      returning(fields = this.config.table[SQLiteTable.Symbol.Columns]) {
        this.config.returning = orderSelectedFields(fields);
        return this;
      }
      /** @internal */
      getSQL() {
        return this.dialect.buildUpdateQuery(this.config);
      }
      toSQL() {
        const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
        return rest;
      }
      /** @internal */
      _prepare(isOneTimeQuery = true) {
        return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
          this.dialect.sqlToQuery(this.getSQL()),
          this.config.returning,
          this.config.returning ? "all" : "run",
          true,
          void 0,
          {
            type: "insert",
            tables: extractUsedTable(this.config.table)
          }
        );
      }
      prepare() {
        return this._prepare(false);
      }
      run = (placeholderValues) => {
        return this._prepare().run(placeholderValues);
      };
      all = (placeholderValues) => {
        return this._prepare().all(placeholderValues);
      };
      get = (placeholderValues) => {
        return this._prepare().get(placeholderValues);
      };
      values = (placeholderValues) => {
        return this._prepare().values(placeholderValues);
      };
      async execute() {
        return this.config.returning ? this.all() : this.run();
      }
      $dynamic() {
        return this;
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/query-builders/index.js
var init_query_builders = __esm({
  "node_modules/drizzle-orm/sqlite-core/query-builders/index.js"() {
    init_delete();
    init_insert();
    init_query_builder2();
    init_select2();
    init_select_types();
    init_update();
  }
});

// node_modules/drizzle-orm/sqlite-core/query-builders/count.js
var SQLiteCountBuilder;
var init_count = __esm({
  "node_modules/drizzle-orm/sqlite-core/query-builders/count.js"() {
    init_entity();
    init_sql();
    SQLiteCountBuilder = class _SQLiteCountBuilder extends SQL {
      constructor(params) {
        super(_SQLiteCountBuilder.buildEmbeddedCount(params.source, params.filters).queryChunks);
        this.params = params;
        this.session = params.session;
        this.sql = _SQLiteCountBuilder.buildCount(
          params.source,
          params.filters
        );
      }
      sql;
      static [entityKind] = "SQLiteCountBuilderAsync";
      [Symbol.toStringTag] = "SQLiteCountBuilderAsync";
      session;
      static buildEmbeddedCount(source, filters) {
        return sql`(select count(*) from ${source}${sql.raw(" where ").if(filters)}${filters})`;
      }
      static buildCount(source, filters) {
        return sql`select count(*) from ${source}${sql.raw(" where ").if(filters)}${filters}`;
      }
      then(onfulfilled, onrejected) {
        return Promise.resolve(this.session.count(this.sql)).then(
          onfulfilled,
          onrejected
        );
      }
      catch(onRejected) {
        return this.then(void 0, onRejected);
      }
      finally(onFinally) {
        return this.then(
          (value) => {
            onFinally?.();
            return value;
          },
          (reason) => {
            onFinally?.();
            throw reason;
          }
        );
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/query-builders/query.js
var RelationalQueryBuilder, SQLiteRelationalQuery, SQLiteSyncRelationalQuery;
var init_query = __esm({
  "node_modules/drizzle-orm/sqlite-core/query-builders/query.js"() {
    init_entity();
    init_query_promise();
    init_relations();
    RelationalQueryBuilder = class {
      constructor(mode, fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session) {
        this.mode = mode;
        this.fullSchema = fullSchema;
        this.schema = schema;
        this.tableNamesMap = tableNamesMap;
        this.table = table;
        this.tableConfig = tableConfig;
        this.dialect = dialect;
        this.session = session;
      }
      static [entityKind] = "SQLiteAsyncRelationalQueryBuilder";
      findMany(config) {
        return this.mode === "sync" ? new SQLiteSyncRelationalQuery(
          this.fullSchema,
          this.schema,
          this.tableNamesMap,
          this.table,
          this.tableConfig,
          this.dialect,
          this.session,
          config ? config : {},
          "many"
        ) : new SQLiteRelationalQuery(
          this.fullSchema,
          this.schema,
          this.tableNamesMap,
          this.table,
          this.tableConfig,
          this.dialect,
          this.session,
          config ? config : {},
          "many"
        );
      }
      findFirst(config) {
        return this.mode === "sync" ? new SQLiteSyncRelationalQuery(
          this.fullSchema,
          this.schema,
          this.tableNamesMap,
          this.table,
          this.tableConfig,
          this.dialect,
          this.session,
          config ? { ...config, limit: 1 } : { limit: 1 },
          "first"
        ) : new SQLiteRelationalQuery(
          this.fullSchema,
          this.schema,
          this.tableNamesMap,
          this.table,
          this.tableConfig,
          this.dialect,
          this.session,
          config ? { ...config, limit: 1 } : { limit: 1 },
          "first"
        );
      }
    };
    SQLiteRelationalQuery = class extends QueryPromise {
      constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session, config, mode) {
        super();
        this.fullSchema = fullSchema;
        this.schema = schema;
        this.tableNamesMap = tableNamesMap;
        this.table = table;
        this.tableConfig = tableConfig;
        this.dialect = dialect;
        this.session = session;
        this.config = config;
        this.mode = mode;
      }
      static [entityKind] = "SQLiteAsyncRelationalQuery";
      /** @internal */
      mode;
      /** @internal */
      getSQL() {
        return this.dialect.buildRelationalQuery({
          fullSchema: this.fullSchema,
          schema: this.schema,
          tableNamesMap: this.tableNamesMap,
          table: this.table,
          tableConfig: this.tableConfig,
          queryConfig: this.config,
          tableAlias: this.tableConfig.tsName
        }).sql;
      }
      /** @internal */
      _prepare(isOneTimeQuery = false) {
        const { query, builtQuery } = this._toSQL();
        return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
          builtQuery,
          void 0,
          this.mode === "first" ? "get" : "all",
          true,
          (rawRows, mapColumnValue) => {
            const rows = rawRows.map(
              (row) => mapRelationalRow(this.schema, this.tableConfig, row, query.selection, mapColumnValue)
            );
            if (this.mode === "first") {
              return rows[0];
            }
            return rows;
          }
        );
      }
      prepare() {
        return this._prepare(false);
      }
      _toSQL() {
        const query = this.dialect.buildRelationalQuery({
          fullSchema: this.fullSchema,
          schema: this.schema,
          tableNamesMap: this.tableNamesMap,
          table: this.table,
          tableConfig: this.tableConfig,
          queryConfig: this.config,
          tableAlias: this.tableConfig.tsName
        });
        const builtQuery = this.dialect.sqlToQuery(query.sql);
        return { query, builtQuery };
      }
      toSQL() {
        return this._toSQL().builtQuery;
      }
      /** @internal */
      executeRaw() {
        if (this.mode === "first") {
          return this._prepare(false).get();
        }
        return this._prepare(false).all();
      }
      async execute() {
        return this.executeRaw();
      }
    };
    SQLiteSyncRelationalQuery = class extends SQLiteRelationalQuery {
      static [entityKind] = "SQLiteSyncRelationalQuery";
      sync() {
        return this.executeRaw();
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/query-builders/raw.js
var SQLiteRaw;
var init_raw = __esm({
  "node_modules/drizzle-orm/sqlite-core/query-builders/raw.js"() {
    init_entity();
    init_query_promise();
    SQLiteRaw = class extends QueryPromise {
      constructor(execute, getSQL, action, dialect, mapBatchResult) {
        super();
        this.execute = execute;
        this.getSQL = getSQL;
        this.dialect = dialect;
        this.mapBatchResult = mapBatchResult;
        this.config = { action };
      }
      static [entityKind] = "SQLiteRaw";
      /** @internal */
      config;
      getQuery() {
        return { ...this.dialect.sqlToQuery(this.getSQL()), method: this.config.action };
      }
      mapResult(result, isFromBatch) {
        return isFromBatch ? this.mapBatchResult(result) : result;
      }
      _prepare() {
        return this;
      }
      /** @internal */
      isResponseInArrayMode() {
        return false;
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/db.js
var BaseSQLiteDatabase;
var init_db = __esm({
  "node_modules/drizzle-orm/sqlite-core/db.js"() {
    init_entity();
    init_selection_proxy();
    init_sql();
    init_query_builders();
    init_subquery();
    init_count();
    init_query();
    init_raw();
    BaseSQLiteDatabase = class {
      constructor(resultKind, dialect, session, schema) {
        this.resultKind = resultKind;
        this.dialect = dialect;
        this.session = session;
        this._ = schema ? {
          schema: schema.schema,
          fullSchema: schema.fullSchema,
          tableNamesMap: schema.tableNamesMap
        } : {
          schema: void 0,
          fullSchema: {},
          tableNamesMap: {}
        };
        this.query = {};
        const query = this.query;
        if (this._.schema) {
          for (const [tableName, columns] of Object.entries(this._.schema)) {
            query[tableName] = new RelationalQueryBuilder(
              resultKind,
              schema.fullSchema,
              this._.schema,
              this._.tableNamesMap,
              schema.fullSchema[tableName],
              columns,
              dialect,
              session
            );
          }
        }
        this.$cache = { invalidate: async (_params) => {
        } };
      }
      static [entityKind] = "BaseSQLiteDatabase";
      query;
      /**
       * Creates a subquery that defines a temporary named result set as a CTE.
       *
       * It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
       *
       * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
       *
       * @param alias The alias for the subquery.
       *
       * Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
       *
       * @example
       *
       * ```ts
       * // Create a subquery with alias 'sq' and use it in the select query
       * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
       *
       * const result = await db.with(sq).select().from(sq);
       * ```
       *
       * To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
       *
       * ```ts
       * // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
       * const sq = db.$with('sq').as(db.select({
       *   name: sql<string>`upper(${users.name})`.as('name'),
       * })
       * .from(users));
       *
       * const result = await db.with(sq).select({ name: sq.name }).from(sq);
       * ```
       */
      $with = (alias, selection) => {
        const self = this;
        const as = (qb) => {
          if (typeof qb === "function") {
            qb = qb(new QueryBuilder(self.dialect));
          }
          return new Proxy(
            new WithSubquery(
              qb.getSQL(),
              selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}),
              alias,
              true
            ),
            new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
          );
        };
        return { as };
      };
      $count(source, filters) {
        return new SQLiteCountBuilder({ source, filters, session: this.session });
      }
      /**
       * Incorporates a previously defined CTE (using `$with`) into the main query.
       *
       * This method allows the main query to reference a temporary named result set.
       *
       * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
       *
       * @param queries The CTEs to incorporate into the main query.
       *
       * @example
       *
       * ```ts
       * // Define a subquery 'sq' as a CTE using $with
       * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
       *
       * // Incorporate the CTE 'sq' into the main query and select from it
       * const result = await db.with(sq).select().from(sq);
       * ```
       */
      with(...queries) {
        const self = this;
        function select(fields) {
          return new SQLiteSelectBuilder({
            fields: fields ?? void 0,
            session: self.session,
            dialect: self.dialect,
            withList: queries
          });
        }
        function selectDistinct(fields) {
          return new SQLiteSelectBuilder({
            fields: fields ?? void 0,
            session: self.session,
            dialect: self.dialect,
            withList: queries,
            distinct: true
          });
        }
        function update(table) {
          return new SQLiteUpdateBuilder(table, self.session, self.dialect, queries);
        }
        function insert(into) {
          return new SQLiteInsertBuilder(into, self.session, self.dialect, queries);
        }
        function delete_(from) {
          return new SQLiteDeleteBase(from, self.session, self.dialect, queries);
        }
        return { select, selectDistinct, update, insert, delete: delete_ };
      }
      select(fields) {
        return new SQLiteSelectBuilder({ fields: fields ?? void 0, session: this.session, dialect: this.dialect });
      }
      selectDistinct(fields) {
        return new SQLiteSelectBuilder({
          fields: fields ?? void 0,
          session: this.session,
          dialect: this.dialect,
          distinct: true
        });
      }
      /**
       * Creates an update query.
       *
       * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
       *
       * Use `.set()` method to specify which values to update.
       *
       * See docs: {@link https://orm.drizzle.team/docs/update}
       *
       * @param table The table to update.
       *
       * @example
       *
       * ```ts
       * // Update all rows in the 'cars' table
       * await db.update(cars).set({ color: 'red' });
       *
       * // Update rows with filters and conditions
       * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
       *
       * // Update with returning clause
       * const updatedCar: Car[] = await db.update(cars)
       *   .set({ color: 'red' })
       *   .where(eq(cars.id, 1))
       *   .returning();
       * ```
       */
      update(table) {
        return new SQLiteUpdateBuilder(table, this.session, this.dialect);
      }
      $cache;
      /**
       * Creates an insert query.
       *
       * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
       *
       * See docs: {@link https://orm.drizzle.team/docs/insert}
       *
       * @param table The table to insert into.
       *
       * @example
       *
       * ```ts
       * // Insert one row
       * await db.insert(cars).values({ brand: 'BMW' });
       *
       * // Insert multiple rows
       * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
       *
       * // Insert with returning clause
       * const insertedCar: Car[] = await db.insert(cars)
       *   .values({ brand: 'BMW' })
       *   .returning();
       * ```
       */
      insert(into) {
        return new SQLiteInsertBuilder(into, this.session, this.dialect);
      }
      /**
       * Creates a delete query.
       *
       * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
       *
       * See docs: {@link https://orm.drizzle.team/docs/delete}
       *
       * @param table The table to delete from.
       *
       * @example
       *
       * ```ts
       * // Delete all rows in the 'cars' table
       * await db.delete(cars);
       *
       * // Delete rows with filters and conditions
       * await db.delete(cars).where(eq(cars.color, 'green'));
       *
       * // Delete with returning clause
       * const deletedCar: Car[] = await db.delete(cars)
       *   .where(eq(cars.id, 1))
       *   .returning();
       * ```
       */
      delete(from) {
        return new SQLiteDeleteBase(from, this.session, this.dialect);
      }
      run(query) {
        const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
        if (this.resultKind === "async") {
          return new SQLiteRaw(
            async () => this.session.run(sequel),
            () => sequel,
            "run",
            this.dialect,
            this.session.extractRawRunValueFromBatchResult.bind(this.session)
          );
        }
        return this.session.run(sequel);
      }
      all(query) {
        const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
        if (this.resultKind === "async") {
          return new SQLiteRaw(
            async () => this.session.all(sequel),
            () => sequel,
            "all",
            this.dialect,
            this.session.extractRawAllValueFromBatchResult.bind(this.session)
          );
        }
        return this.session.all(sequel);
      }
      get(query) {
        const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
        if (this.resultKind === "async") {
          return new SQLiteRaw(
            async () => this.session.get(sequel),
            () => sequel,
            "get",
            this.dialect,
            this.session.extractRawGetValueFromBatchResult.bind(this.session)
          );
        }
        return this.session.get(sequel);
      }
      values(query) {
        const sequel = typeof query === "string" ? sql.raw(query) : query.getSQL();
        if (this.resultKind === "async") {
          return new SQLiteRaw(
            async () => this.session.values(sequel),
            () => sequel,
            "values",
            this.dialect,
            this.session.extractRawValuesValueFromBatchResult.bind(this.session)
          );
        }
        return this.session.values(sequel);
      }
      transaction(transaction, config) {
        return this.session.transaction(transaction, config);
      }
    };
  }
});

// node_modules/drizzle-orm/cache/core/cache.js
async function hashQuery(sql2, params) {
  const dataToHash = `${sql2}-${JSON.stringify(params)}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(dataToHash);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = [...new Uint8Array(hashBuffer)];
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
var Cache, NoopCache;
var init_cache = __esm({
  "node_modules/drizzle-orm/cache/core/cache.js"() {
    init_entity();
    Cache = class {
      static [entityKind] = "Cache";
    };
    NoopCache = class extends Cache {
      strategy() {
        return "all";
      }
      static [entityKind] = "NoopCache";
      async get(_key) {
        return void 0;
      }
      async put(_hashedQuery, _response, _tables, _config) {
      }
      async onMutate(_params) {
      }
    };
  }
});

// node_modules/drizzle-orm/cache/core/index.js
var init_core = __esm({
  "node_modules/drizzle-orm/cache/core/index.js"() {
    init_cache();
  }
});

// node_modules/drizzle-orm/sqlite-core/alias.js
var init_alias2 = __esm({
  "node_modules/drizzle-orm/sqlite-core/alias.js"() {
  }
});

// node_modules/drizzle-orm/sqlite-core/session.js
var ExecuteResultSync, SQLitePreparedQuery, SQLiteSession, SQLiteTransaction;
var init_session = __esm({
  "node_modules/drizzle-orm/sqlite-core/session.js"() {
    init_cache();
    init_entity();
    init_errors();
    init_query_promise();
    init_db();
    ExecuteResultSync = class extends QueryPromise {
      constructor(resultCb) {
        super();
        this.resultCb = resultCb;
      }
      static [entityKind] = "ExecuteResultSync";
      async execute() {
        return this.resultCb();
      }
      sync() {
        return this.resultCb();
      }
    };
    SQLitePreparedQuery = class {
      constructor(mode, executeMethod, query, cache, queryMetadata, cacheConfig) {
        this.mode = mode;
        this.executeMethod = executeMethod;
        this.query = query;
        this.cache = cache;
        this.queryMetadata = queryMetadata;
        this.cacheConfig = cacheConfig;
        if (cache && cache.strategy() === "all" && cacheConfig === void 0) {
          this.cacheConfig = { enable: true, autoInvalidate: true };
        }
        if (!this.cacheConfig?.enable) {
          this.cacheConfig = void 0;
        }
      }
      static [entityKind] = "PreparedQuery";
      /** @internal */
      joinsNotNullableMap;
      /** @internal */
      async queryWithCache(queryString, params, query) {
        if (this.cache === void 0 || is(this.cache, NoopCache) || this.queryMetadata === void 0) {
          try {
            return await query();
          } catch (e) {
            throw new DrizzleQueryError(queryString, params, e);
          }
        }
        if (this.cacheConfig && !this.cacheConfig.enable) {
          try {
            return await query();
          } catch (e) {
            throw new DrizzleQueryError(queryString, params, e);
          }
        }
        if ((this.queryMetadata.type === "insert" || this.queryMetadata.type === "update" || this.queryMetadata.type === "delete") && this.queryMetadata.tables.length > 0) {
          try {
            const [res] = await Promise.all([
              query(),
              this.cache.onMutate({ tables: this.queryMetadata.tables })
            ]);
            return res;
          } catch (e) {
            throw new DrizzleQueryError(queryString, params, e);
          }
        }
        if (!this.cacheConfig) {
          try {
            return await query();
          } catch (e) {
            throw new DrizzleQueryError(queryString, params, e);
          }
        }
        if (this.queryMetadata.type === "select") {
          const fromCache = await this.cache.get(
            this.cacheConfig.tag ?? await hashQuery(queryString, params),
            this.queryMetadata.tables,
            this.cacheConfig.tag !== void 0,
            this.cacheConfig.autoInvalidate
          );
          if (fromCache === void 0) {
            let result;
            try {
              result = await query();
            } catch (e) {
              throw new DrizzleQueryError(queryString, params, e);
            }
            await this.cache.put(
              this.cacheConfig.tag ?? await hashQuery(queryString, params),
              result,
              // make sure we send tables that were used in a query only if user wants to invalidate it on each write
              this.cacheConfig.autoInvalidate ? this.queryMetadata.tables : [],
              this.cacheConfig.tag !== void 0,
              this.cacheConfig.config
            );
            return result;
          }
          return fromCache;
        }
        try {
          return await query();
        } catch (e) {
          throw new DrizzleQueryError(queryString, params, e);
        }
      }
      getQuery() {
        return this.query;
      }
      mapRunResult(result, _isFromBatch) {
        return result;
      }
      mapAllResult(_result, _isFromBatch) {
        throw new Error("Not implemented");
      }
      mapGetResult(_result, _isFromBatch) {
        throw new Error("Not implemented");
      }
      execute(placeholderValues) {
        if (this.mode === "async") {
          return this[this.executeMethod](placeholderValues);
        }
        return new ExecuteResultSync(() => this[this.executeMethod](placeholderValues));
      }
      mapResult(response, isFromBatch) {
        switch (this.executeMethod) {
          case "run": {
            return this.mapRunResult(response, isFromBatch);
          }
          case "all": {
            return this.mapAllResult(response, isFromBatch);
          }
          case "get": {
            return this.mapGetResult(response, isFromBatch);
          }
        }
      }
    };
    SQLiteSession = class {
      constructor(dialect) {
        this.dialect = dialect;
      }
      static [entityKind] = "SQLiteSession";
      prepareOneTimeQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
        return this.prepareQuery(
          query,
          fields,
          executeMethod,
          isResponseInArrayMode,
          customResultMapper,
          queryMetadata,
          cacheConfig
        );
      }
      run(query) {
        const staticQuery = this.dialect.sqlToQuery(query);
        try {
          return this.prepareOneTimeQuery(staticQuery, void 0, "run", false).run();
        } catch (err) {
          throw new DrizzleError({ cause: err, message: `Failed to run the query '${staticQuery.sql}'` });
        }
      }
      /** @internal */
      extractRawRunValueFromBatchResult(result) {
        return result;
      }
      all(query) {
        return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).all();
      }
      /** @internal */
      extractRawAllValueFromBatchResult(_result) {
        throw new Error("Not implemented");
      }
      get(query) {
        return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).get();
      }
      /** @internal */
      extractRawGetValueFromBatchResult(_result) {
        throw new Error("Not implemented");
      }
      values(query) {
        return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).values();
      }
      async count(sql2) {
        const result = await this.values(sql2);
        return result[0][0];
      }
      /** @internal */
      extractRawValuesValueFromBatchResult(_result) {
        throw new Error("Not implemented");
      }
    };
    SQLiteTransaction = class extends BaseSQLiteDatabase {
      constructor(resultType, dialect, session, schema, nestedIndex = 0) {
        super(resultType, dialect, session, schema);
        this.schema = schema;
        this.nestedIndex = nestedIndex;
      }
      static [entityKind] = "SQLiteTransaction";
      rollback() {
        throw new TransactionRollbackError();
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/subquery.js
var init_subquery2 = __esm({
  "node_modules/drizzle-orm/sqlite-core/subquery.js"() {
  }
});

// node_modules/drizzle-orm/sqlite-core/view.js
var ViewBuilderCore, ViewBuilder, ManualViewBuilder, SQLiteView;
var init_view = __esm({
  "node_modules/drizzle-orm/sqlite-core/view.js"() {
    init_entity();
    init_selection_proxy();
    init_utils();
    init_query_builder2();
    init_table3();
    init_view_base();
    ViewBuilderCore = class {
      constructor(name) {
        this.name = name;
      }
      static [entityKind] = "SQLiteViewBuilderCore";
      config = {};
    };
    ViewBuilder = class extends ViewBuilderCore {
      static [entityKind] = "SQLiteViewBuilder";
      as(qb) {
        if (typeof qb === "function") {
          qb = qb(new QueryBuilder());
        }
        const selectionProxy = new SelectionProxyHandler({
          alias: this.name,
          sqlBehavior: "error",
          sqlAliasedBehavior: "alias",
          replaceOriginalName: true
        });
        const aliasedSelectedFields = qb.getSelectedFields();
        return new Proxy(
          new SQLiteView({
            // sqliteConfig: this.config,
            config: {
              name: this.name,
              schema: void 0,
              selectedFields: aliasedSelectedFields,
              query: qb.getSQL().inlineParams()
            }
          }),
          selectionProxy
        );
      }
    };
    ManualViewBuilder = class extends ViewBuilderCore {
      static [entityKind] = "SQLiteManualViewBuilder";
      columns;
      constructor(name, columns) {
        super(name);
        this.columns = getTableColumns(sqliteTable(name, columns));
      }
      existing() {
        return new Proxy(
          new SQLiteView({
            config: {
              name: this.name,
              schema: void 0,
              selectedFields: this.columns,
              query: void 0
            }
          }),
          new SelectionProxyHandler({
            alias: this.name,
            sqlBehavior: "error",
            sqlAliasedBehavior: "alias",
            replaceOriginalName: true
          })
        );
      }
      as(query) {
        return new Proxy(
          new SQLiteView({
            config: {
              name: this.name,
              schema: void 0,
              selectedFields: this.columns,
              query: query.inlineParams()
            }
          }),
          new SelectionProxyHandler({
            alias: this.name,
            sqlBehavior: "error",
            sqlAliasedBehavior: "alias",
            replaceOriginalName: true
          })
        );
      }
    };
    SQLiteView = class extends SQLiteViewBase {
      static [entityKind] = "SQLiteView";
      constructor({ config }) {
        super(config);
      }
    };
  }
});

// node_modules/drizzle-orm/sqlite-core/index.js
var init_sqlite_core = __esm({
  "node_modules/drizzle-orm/sqlite-core/index.js"() {
    init_alias2();
    init_checks();
    init_columns();
    init_db();
    init_dialect();
    init_foreign_keys2();
    init_indexes();
    init_primary_keys2();
    init_query_builders();
    init_session();
    init_subquery2();
    init_table3();
    init_unique_constraint2();
    init_utils2();
    init_view();
  }
});

// node_modules/drizzle-orm/libsql/session.js
function normalizeRow(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    if (Object.prototype.propertyIsEnumerable.call(obj, key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}
function normalizeFieldValue(value) {
  if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
    if (typeof Buffer !== "undefined") {
      if (!(value instanceof Buffer)) {
        return Buffer.from(value);
      }
      return value;
    }
    if (typeof TextDecoder !== "undefined") {
      return new TextDecoder().decode(value);
    }
    throw new Error("TextDecoder is not available. Please provide either Buffer or TextDecoder polyfill.");
  }
  return value;
}
var LibSQLSession, LibSQLTransaction, LibSQLPreparedQuery;
var init_session2 = __esm({
  "node_modules/drizzle-orm/libsql/session.js"() {
    init_core();
    init_entity();
    init_logger();
    init_sql();
    init_sqlite_core();
    init_session();
    init_utils();
    LibSQLSession = class _LibSQLSession extends SQLiteSession {
      constructor(client, dialect, schema, options, tx) {
        super(dialect);
        this.client = client;
        this.schema = schema;
        this.options = options;
        this.tx = tx;
        this.logger = options.logger ?? new NoopLogger();
        this.cache = options.cache ?? new NoopCache();
      }
      static [entityKind] = "LibSQLSession";
      logger;
      cache;
      prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
        return new LibSQLPreparedQuery(
          this.client,
          query,
          this.logger,
          this.cache,
          queryMetadata,
          cacheConfig,
          fields,
          this.tx,
          executeMethod,
          isResponseInArrayMode,
          customResultMapper
        );
      }
      async batch(queries) {
        const preparedQueries = [];
        const builtQueries = [];
        for (const query of queries) {
          const preparedQuery = query._prepare();
          const builtQuery = preparedQuery.getQuery();
          preparedQueries.push(preparedQuery);
          builtQueries.push({ sql: builtQuery.sql, args: builtQuery.params });
        }
        const batchResults = await this.client.batch(builtQueries);
        return batchResults.map((result, i) => preparedQueries[i].mapResult(result, true));
      }
      async migrate(queries) {
        const preparedQueries = [];
        const builtQueries = [];
        for (const query of queries) {
          const preparedQuery = query._prepare();
          const builtQuery = preparedQuery.getQuery();
          preparedQueries.push(preparedQuery);
          builtQueries.push({ sql: builtQuery.sql, args: builtQuery.params });
        }
        const batchResults = await this.client.migrate(builtQueries);
        return batchResults.map((result, i) => preparedQueries[i].mapResult(result, true));
      }
      async transaction(transaction, _config) {
        const libsqlTx = await this.client.transaction();
        const session = new _LibSQLSession(
          this.client,
          this.dialect,
          this.schema,
          this.options,
          libsqlTx
        );
        const tx = new LibSQLTransaction("async", this.dialect, session, this.schema);
        try {
          const result = await transaction(tx);
          await libsqlTx.commit();
          return result;
        } catch (err) {
          await libsqlTx.rollback();
          throw err;
        }
      }
      extractRawAllValueFromBatchResult(result) {
        return result.rows;
      }
      extractRawGetValueFromBatchResult(result) {
        return result.rows[0];
      }
      extractRawValuesValueFromBatchResult(result) {
        return result.rows;
      }
    };
    LibSQLTransaction = class _LibSQLTransaction extends SQLiteTransaction {
      static [entityKind] = "LibSQLTransaction";
      async transaction(transaction) {
        const savepointName = `sp${this.nestedIndex}`;
        const tx = new _LibSQLTransaction("async", this.dialect, this.session, this.schema, this.nestedIndex + 1);
        await this.session.run(sql.raw(`savepoint ${savepointName}`));
        try {
          const result = await transaction(tx);
          await this.session.run(sql.raw(`release savepoint ${savepointName}`));
          return result;
        } catch (err) {
          await this.session.run(sql.raw(`rollback to savepoint ${savepointName}`));
          throw err;
        }
      }
    };
    LibSQLPreparedQuery = class extends SQLitePreparedQuery {
      constructor(client, query, logger, cache, queryMetadata, cacheConfig, fields, tx, executeMethod, _isResponseInArrayMode, customResultMapper) {
        super("async", executeMethod, query, cache, queryMetadata, cacheConfig);
        this.client = client;
        this.logger = logger;
        this.fields = fields;
        this.tx = tx;
        this._isResponseInArrayMode = _isResponseInArrayMode;
        this.customResultMapper = customResultMapper;
        this.customResultMapper = customResultMapper;
        this.fields = fields;
      }
      static [entityKind] = "LibSQLPreparedQuery";
      async run(placeholderValues) {
        const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        return await this.queryWithCache(this.query.sql, params, async () => {
          const stmt = { sql: this.query.sql, args: params };
          return this.tx ? this.tx.execute(stmt) : this.client.execute(stmt);
        });
      }
      async all(placeholderValues) {
        const { fields, logger, query, tx, client, customResultMapper } = this;
        if (!fields && !customResultMapper) {
          const params = fillPlaceholders(query.params, placeholderValues ?? {});
          logger.logQuery(query.sql, params);
          return await this.queryWithCache(query.sql, params, async () => {
            const stmt = { sql: query.sql, args: params };
            return (tx ? tx.execute(stmt) : client.execute(stmt)).then(({ rows: rows2 }) => this.mapAllResult(rows2));
          });
        }
        const rows = await this.values(placeholderValues);
        return this.mapAllResult(rows);
      }
      mapAllResult(rows, isFromBatch) {
        if (isFromBatch) {
          rows = rows.rows;
        }
        if (!this.fields && !this.customResultMapper) {
          return rows.map((row) => normalizeRow(row));
        }
        if (this.customResultMapper) {
          return this.customResultMapper(rows, normalizeFieldValue);
        }
        return rows.map((row) => {
          return mapResultRow(
            this.fields,
            Array.prototype.slice.call(row).map((v) => normalizeFieldValue(v)),
            this.joinsNotNullableMap
          );
        });
      }
      async get(placeholderValues) {
        const { fields, logger, query, tx, client, customResultMapper } = this;
        if (!fields && !customResultMapper) {
          const params = fillPlaceholders(query.params, placeholderValues ?? {});
          logger.logQuery(query.sql, params);
          return await this.queryWithCache(query.sql, params, async () => {
            const stmt = { sql: query.sql, args: params };
            return (tx ? tx.execute(stmt) : client.execute(stmt)).then(({ rows: rows2 }) => this.mapGetResult(rows2));
          });
        }
        const rows = await this.values(placeholderValues);
        return this.mapGetResult(rows);
      }
      mapGetResult(rows, isFromBatch) {
        if (isFromBatch) {
          rows = rows.rows;
        }
        const row = rows[0];
        if (!this.fields && !this.customResultMapper) {
          return normalizeRow(row);
        }
        if (!row) {
          return void 0;
        }
        if (this.customResultMapper) {
          return this.customResultMapper(rows, normalizeFieldValue);
        }
        return mapResultRow(
          this.fields,
          Array.prototype.slice.call(row).map((v) => normalizeFieldValue(v)),
          this.joinsNotNullableMap
        );
      }
      async values(placeholderValues) {
        const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
        this.logger.logQuery(this.query.sql, params);
        return await this.queryWithCache(this.query.sql, params, async () => {
          const stmt = { sql: this.query.sql, args: params };
          return (this.tx ? this.tx.execute(stmt) : this.client.execute(stmt)).then(({ rows }) => rows);
        });
      }
      /** @internal */
      isResponseInArrayMode() {
        return this._isResponseInArrayMode;
      }
    };
  }
});

// node_modules/drizzle-orm/libsql/driver-core.js
function construct(client, config = {}) {
  const dialect = new SQLiteAsyncDialect({ casing: config.casing });
  let logger;
  if (config.logger === true) {
    logger = new DefaultLogger();
  } else if (config.logger !== false) {
    logger = config.logger;
  }
  let schema;
  if (config.schema) {
    const tablesConfig = extractTablesRelationalConfig(
      config.schema,
      createTableRelationsHelpers
    );
    schema = {
      fullSchema: config.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const session = new LibSQLSession(client, dialect, schema, { logger, cache: config.cache }, void 0);
  const db = new LibSQLDatabase("async", dialect, session, schema);
  db.$client = client;
  db.$cache = config.cache;
  if (db.$cache) {
    db.$cache["invalidate"] = config.cache?.onMutate;
  }
  return db;
}
var LibSQLDatabase;
var init_driver_core = __esm({
  "node_modules/drizzle-orm/libsql/driver-core.js"() {
    init_entity();
    init_logger();
    init_relations();
    init_db();
    init_dialect();
    init_session2();
    LibSQLDatabase = class extends BaseSQLiteDatabase {
      static [entityKind] = "LibSQLDatabase";
      async batch(batch) {
        return this.session.batch(batch);
      }
    };
  }
});

// node_modules/drizzle-orm/libsql/driver.js
function drizzle(...params) {
  if (typeof params[0] === "string") {
    const instance = createClient({
      url: params[0]
    });
    return construct(instance, params[1]);
  }
  if (isConfig(params[0])) {
    const { connection, client, ...drizzleConfig } = params[0];
    if (client)
      return construct(client, drizzleConfig);
    const instance = typeof connection === "string" ? createClient({ url: connection }) : createClient(connection);
    return construct(instance, drizzleConfig);
  }
  return construct(params[0], params[1]);
}
var init_driver = __esm({
  "node_modules/drizzle-orm/libsql/driver.js"() {
    init_node2();
    init_utils();
    init_driver_core();
    ((drizzle2) => {
      function mock(config) {
        return construct({}, config);
      }
      drizzle2.mock = mock;
    })(drizzle || (drizzle = {}));
  }
});

// node_modules/drizzle-orm/libsql/index.js
var init_libsql = __esm({
  "node_modules/drizzle-orm/libsql/index.js"() {
    init_driver();
    init_session2();
  }
});

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  messages: () => messages,
  secrets_detected: () => secrets_detected,
  sessions: () => sessions
});
var sessions, messages, secrets_detected;
var init_schema = __esm({
  "src/db/schema.ts"() {
    "use strict";
    init_sqlite_core();
    sessions = sqliteTable("sessions", {
      id: text("id").primaryKey(),
      title: text("title").notNull().unique(),
      ai_tool: text("ai_tool"),
      created_at: text("created_at").notNull(),
      updated_at: text("updated_at").notNull()
    });
    messages = sqliteTable("messages", {
      id: text("id").primaryKey(),
      session_id: text("session_id").notNull().references(() => sessions.id),
      role: text("role", { enum: ["user", "assistant"] }).notNull(),
      content: text("content").notNull(),
      created_at: text("created_at").notNull(),
      prev_hash: text("prev_hash"),
      content_hash: text("content_hash")
    });
    secrets_detected = sqliteTable("secrets_detected", {
      id: text("id").primaryKey(),
      session_id: text("session_id").notNull().references(() => sessions.id),
      message_id: text("message_id").notNull().references(() => messages.id),
      type: text("type").notNull(),
      masked_value: text("masked_value").notNull(),
      detected_at: text("detected_at").notNull()
    });
  }
});

// src/db/index.ts
function getDbPath() {
  const envPath = process.env.CHRON_DB_PATH;
  if (envPath)
    return envPath;
  return (0, import_path.join)((0, import_os.homedir)(), ".chron", "chron.db");
}
async function initDb(dbPath2) {
  const path = dbPath2 ?? getDbPath();
  if (!path.startsWith(":")) {
    (0, import_fs.mkdirSync)((0, import_path.dirname)(path), { recursive: true });
  }
  const client = createClient({ url: path.startsWith(":") ? path : `file:${path}` });
  await client.execute("PRAGMA journal_mode = WAL");
  await client.execute("PRAGMA foreign_keys = ON");
  for (const sql2 of CREATE_SQL) {
    await client.execute(sql2);
  }
  const tableInfo = await client.execute("PRAGMA table_info(messages)");
  const columns = tableInfo.rows.map((r) => r[1]);
  if (!columns.includes("prev_hash")) {
    await client.execute("ALTER TABLE messages ADD COLUMN prev_hash TEXT");
  }
  if (!columns.includes("content_hash")) {
    await client.execute("ALTER TABLE messages ADD COLUMN content_hash TEXT");
  }
  return drizzle(client, { schema: schema_exports });
}
var import_os, import_fs, import_path, CREATE_SQL;
var init_db2 = __esm({
  "src/db/index.ts"() {
    "use strict";
    init_node2();
    init_libsql();
    import_os = require("os");
    import_fs = require("fs");
    import_path = require("path");
    init_schema();
    CREATE_SQL = [
      `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
    ai_tool TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
      `CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    prev_hash TEXT,
    content_hash TEXT,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
  )`,
      `CREATE TABLE IF NOT EXISTS secrets_detected (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    message_id TEXT NOT NULL,
    type TEXT NOT NULL,
    masked_value TEXT NOT NULL,
    detected_at TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
  )`,
      `CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_title ON sessions(title)`,
      `CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id)`,
      `CREATE INDEX IF NOT EXISTS idx_secrets_detected_session_id ON secrets_detected(session_id)`,
      `CREATE INDEX IF NOT EXISTS idx_secrets_detected_message_id ON secrets_detected(message_id)`
    ];
  }
});

// src/cli/history.ts
var history_exports = {};
__export(history_exports, {
  runHistory: () => runHistory
});
function fmtDate(iso) {
  return iso.slice(0, 16).replace("T", " ");
}
function fmtTimestamp(iso) {
  const m = iso.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})(?:\.\d+)?([-+]\d{2}:\d{2}|Z)?$/);
  if (!m)
    return iso;
  const tz = !m[3] || m[3] === "Z" ? "+00:00" : m[3];
  return `${m[1]} ${m[2]} ${tz}`;
}
async function printList(limit) {
  const db = await initDb();
  const rows = await db.select({
    id: sessions.id,
    title: sessions.title,
    updated_at: sessions.updated_at,
    message_count: sql`count(${messages.id})`
  }).from(sessions).leftJoin(messages, eq(messages.session_id, sessions.id)).groupBy(sessions.id).orderBy(desc(sessions.updated_at)).limit(limit);
  if (rows.length === 0) {
    process.stdout.write("No sessions found.\n");
    return;
  }
  process.stdout.write("\n");
  for (const row of rows) {
    const date = fmtDate(row.updated_at);
    const prefix = row.id.slice(0, 8);
    const count = String(row.message_count).padStart(3);
    process.stdout.write(
      `  ${DIM}${date}${RESET}  ${CYAN}${prefix}${RESET}  ${BOLD}${count} msgs${RESET}  ${row.title}
`
    );
  }
  process.stdout.write("\n");
}
async function printDetail(prefix) {
  const db = await initDb();
  const all = await db.select({ id: sessions.id, title: sessions.title }).from(sessions);
  const matches = all.filter((s) => s.id.startsWith(prefix));
  if (matches.length === 0) {
    process.stderr.write(`No session found matching prefix: ${prefix}
`);
    process.exit(1);
  }
  if (matches.length > 1) {
    process.stderr.write(
      `Ambiguous prefix "${prefix}" matches ${matches.length} sessions \u2014 use more characters
`
    );
    process.exit(1);
  }
  const session = matches[0];
  const msgs = await db.select().from(messages).where(eq(messages.session_id, session.id)).orderBy(asc(messages.created_at), asc(sql`rowid`));
  process.stdout.write(`
${BOLD}${session.title}${RESET}

`);
  for (const msg of msgs) {
    const ts = fmtTimestamp(msg.created_at);
    const roleColor = msg.role === "user" ? YELLOW : CYAN;
    process.stdout.write(`${DIM}[${ts}]${RESET} ${BOLD}${roleColor}${msg.role}${RESET}
`);
    process.stdout.write(`${msg.content}

`);
  }
}
async function runHistory(args2) {
  const limitArg = args2.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : 20;
  const positional = args2.filter((a) => !a.startsWith("--"));
  if (positional.length === 0) {
    await printList(limit);
  } else {
    await printDetail(positional[0]);
  }
}
var RESET, BOLD, DIM, CYAN, YELLOW;
var init_history = __esm({
  "src/cli/history.ts"() {
    "use strict";
    init_drizzle_orm();
    init_db2();
    init_schema();
    RESET = "\x1B[0m";
    BOLD = "\x1B[1m";
    DIM = "\x1B[2m";
    CYAN = "\x1B[36m";
    YELLOW = "\x1B[33m";
  }
});

// src/cli/report.ts
var report_exports = {};
__export(report_exports, {
  buildReport: () => buildReport,
  parseSince: () => parseSince,
  runReport: () => runReport
});
function parseSince(arg) {
  if (/^\d+d$/.test(arg)) {
    const days = parseInt(arg, 10);
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1e3);
    return cutoff.toISOString().slice(0, 10);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(arg)) {
    return arg;
  }
  throw new Error(`Invalid --since value: "${arg}". Use 7d, 30d, or YYYY-MM-DD.`);
}
async function buildReport(db, cutoffDate) {
  const allSessions = await db.select({
    id: sessions.id,
    ai_tool: sessions.ai_tool,
    updated_at: sessions.updated_at
  }).from(sessions);
  const filtered = cutoffDate ? allSessions.filter((s) => s.updated_at >= cutoffDate) : allSessions;
  const dateTo = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const dateFrom = cutoffDate ?? (filtered.length > 0 ? filtered.map((s) => s.updated_at).sort()[0].slice(0, 10) : dateTo);
  if (filtered.length === 0) {
    return { dateFrom, dateTo, sessionCount: 0, providerCounts: {}, userMessages: 0, aiMessages: 0, secretsTotal: 0, byType: [] };
  }
  const sessionIds = filtered.map((s) => s.id);
  const providerCounts = {};
  for (const s of filtered) {
    const provider = s.ai_tool?.replace("chron-chat/", "") ?? "unknown";
    providerCounts[provider] = (providerCounts[provider] ?? 0) + 1;
  }
  const msgs = await db.select({ role: messages.role }).from(messages).where(inArray(messages.session_id, sessionIds));
  const secs = await db.select({ type: secrets_detected.type }).from(secrets_detected).where(inArray(secrets_detected.session_id, sessionIds));
  const byTypeMap = {};
  for (const s of secs) {
    byTypeMap[s.type] = (byTypeMap[s.type] ?? 0) + 1;
  }
  const byType = Object.entries(byTypeMap).sort((a, b) => b[1] - a[1]);
  return {
    dateFrom,
    dateTo,
    sessionCount: filtered.length,
    providerCounts,
    userMessages: msgs.filter((m) => m.role === "user").length,
    aiMessages: msgs.filter((m) => m.role === "assistant").length,
    secretsTotal: secs.length,
    byType
  };
}
function printReport(data) {
  const { dateFrom, dateTo, sessionCount, providerCounts, userMessages, aiMessages, secretsTotal, byType } = data;
  const providerStr = Object.entries(providerCounts).sort((a, b) => b[1] - a[1]).map(([p, n]) => `${p} ${n}`).join(", ");
  const secretLine = secretsTotal === 0 ? "    0 detected" : `${String(secretsTotal).padStart(4)} detected`;
  process.stdout.write(`
${BOLD2}Chron Report${RESET2}  ${dateFrom} \u2192 ${dateTo}

`);
  if (sessionCount === 0) {
    process.stdout.write("No sessions in this date range.\n\n");
    return;
  }
  process.stdout.write(`${BOLD2}Sessions${RESET2}  ${String(sessionCount).padStart(4)}   (${providerStr})
`);
  process.stdout.write(`${BOLD2}Messages${RESET2}  ${String(userMessages + aiMessages).padStart(4)}   (you: ${userMessages}, ai: ${aiMessages})
`);
  process.stdout.write(`${BOLD2}Secrets${RESET2}   ${secretLine}
`);
  if (byType.length > 0) {
    const maxLen = Math.max(...byType.map(([t]) => t.length));
    process.stdout.write("\nBy type:\n");
    for (const [type, count] of byType) {
      process.stdout.write(`  ${type.padEnd(maxLen)}  ${String(count).padStart(4)}
`);
    }
  }
  process.stdout.write("\n");
}
async function runReport(args2) {
  const sinceArg = args2.find((a) => a.startsWith("--since="))?.slice("--since=".length);
  let cutoffDate = null;
  if (sinceArg) {
    try {
      cutoffDate = parseSince(sinceArg);
    } catch (err) {
      process.stderr.write(`${err instanceof Error ? err.message : String(err)}
`);
      process.exit(1);
    }
  }
  const db = await initDb();
  const data = await buildReport(db, cutoffDate);
  printReport(data);
}
var RESET2, BOLD2;
var init_report = __esm({
  "src/cli/report.ts"() {
    "use strict";
    init_drizzle_orm();
    init_db2();
    init_schema();
    RESET2 = "\x1B[0m";
    BOLD2 = "\x1B[1m";
  }
});

// src/cli/export.ts
var export_exports = {};
__export(export_exports, {
  runExport: () => runExport
});
function fmtTimestamp2(iso) {
  const m = iso.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})(?:\.\d+)?([-+]\d{2}:\d{2}|Z)?$/);
  if (!m)
    return iso;
  const tz = !m[3] || m[3] === "Z" ? "+00:00" : m[3];
  return `${m[1]} ${m[2]} ${tz}`;
}
async function runExport(args2) {
  const prefix = args2.find((a) => !a.startsWith("--"));
  if (!prefix) {
    process.stderr.write("Usage: chron export <session-id-prefix>\n");
    process.exit(1);
  }
  const db = await initDb();
  const all = await db.select({
    id: sessions.id,
    title: sessions.title,
    ai_tool: sessions.ai_tool,
    created_at: sessions.created_at
  }).from(sessions);
  const matches = all.filter((s) => s.id.startsWith(prefix));
  if (matches.length === 0) {
    process.stderr.write(`No session found matching prefix: ${prefix}
`);
    process.exit(1);
  }
  if (matches.length > 1) {
    process.stderr.write(`Ambiguous prefix "${prefix}" matches ${matches.length} sessions \u2014 use more characters
`);
    process.exit(1);
  }
  const session = matches[0];
  const msgs = await db.select().from(messages).where(eq(messages.session_id, session.id)).orderBy(asc(messages.created_at), asc(sql`rowid`));
  const provider = session.ai_tool?.replace("chron-chat/", "") ?? "ai";
  const date = session.created_at.slice(0, 10);
  process.stdout.write(`# ${session.title}

`);
  process.stdout.write(`*${date} | ${provider} | ${msgs.length} message${msgs.length === 1 ? "" : "s"}*
`);
  for (const msg of msgs) {
    const ts = fmtTimestamp2(msg.created_at);
    const roleLabel = msg.role === "user" ? "you" : provider;
    process.stdout.write(`
---

**[${ts}] ${roleLabel}**

${msg.content}
`);
  }
  process.stdout.write("\n");
}
var init_export = __esm({
  "src/cli/export.ts"() {
    "use strict";
    init_drizzle_orm();
    init_db2();
    init_schema();
  }
});

// src/cli/settings.ts
var settings_exports = {};
__export(settings_exports, {
  runSettings: () => runSettings
});
function dbPath() {
  return process.env.CHRON_DB_PATH ?? (0, import_path2.join)((0, import_os2.homedir)(), ".chron", "chron.db");
}
async function runSettings(_args) {
  process.stdout.write(`
${BOLD3}Chron Settings${RESET3}

`);
  process.stdout.write(`  ${DIM2}db${RESET3}  ${CYAN2}${dbPath()}${RESET3}
`);
  process.stdout.write(`
  ${DIM2}Override with CHRON_DB_PATH env var.${RESET3}

`);
}
var import_os2, import_path2, RESET3, BOLD3, DIM2, CYAN2;
var init_settings = __esm({
  "src/cli/settings.ts"() {
    "use strict";
    import_os2 = require("os");
    import_path2 = require("path");
    RESET3 = "\x1B[0m";
    BOLD3 = "\x1B[1m";
    DIM2 = "\x1B[2m";
    CYAN2 = "\x1B[36m";
  }
});

// src/cli/secrets.ts
var secrets_exports = {};
__export(secrets_exports, {
  runSecrets: () => runSecrets
});
function fmtDate2(iso) {
  return iso.slice(0, 16).replace("T", " ");
}
async function runSecrets(args2) {
  const prefix = args2.find((a) => !a.startsWith("--"));
  const db = await initDb();
  if (prefix) {
    const all = await db.select({ id: sessions.id, title: sessions.title }).from(sessions);
    const matches = all.filter((s) => s.id.startsWith(prefix));
    if (matches.length === 0) {
      process.stderr.write(`No session found matching prefix: ${prefix}
`);
      process.exit(1);
    }
    if (matches.length > 1) {
      process.stderr.write(`Ambiguous prefix "${prefix}" matches ${matches.length} sessions \u2014 use more characters
`);
      process.exit(1);
    }
    const session = matches[0];
    const rows = await db.select({
      type: secrets_detected.type,
      masked_value: secrets_detected.masked_value,
      detected_at: secrets_detected.detected_at
    }).from(secrets_detected).where(eq(secrets_detected.session_id, session.id)).orderBy(asc(secrets_detected.detected_at));
    if (rows.length === 0) {
      process.stdout.write(`No secrets detected in: ${session.title}
`);
      return;
    }
    const maxType = Math.max(...rows.map((r) => r.type.length));
    process.stdout.write(`
${BOLD4}${session.title}${RESET4}

`);
    for (const row of rows) {
      process.stdout.write(
        `  ${DIM3}${fmtDate2(row.detected_at)}${RESET4}  ${YELLOW2}${row.type.padEnd(maxType)}${RESET4}  ${row.masked_value}
`
      );
    }
    process.stdout.write("\n");
  } else {
    const rows = await db.select({
      session_id: secrets_detected.session_id,
      type: secrets_detected.type,
      masked_value: secrets_detected.masked_value,
      detected_at: secrets_detected.detected_at,
      title: sessions.title
    }).from(secrets_detected).innerJoin(sessions, eq(secrets_detected.session_id, sessions.id)).orderBy(desc(secrets_detected.detected_at));
    if (rows.length === 0) {
      process.stdout.write("No secrets detected yet.\n\n");
      return;
    }
    const maxType = Math.max(...rows.map((r) => r.type.length));
    process.stdout.write("\n");
    for (const row of rows) {
      process.stdout.write(
        `  ${DIM3}${fmtDate2(row.detected_at)}${RESET4}  ${CYAN3}${row.session_id.slice(0, 8)}${RESET4}  ${YELLOW2}${row.type.padEnd(maxType)}${RESET4}  ${row.masked_value.padEnd(20)}  ${DIM3}${row.title}${RESET4}
`
      );
    }
    process.stdout.write("\n");
  }
}
var RESET4, BOLD4, DIM3, CYAN3, YELLOW2;
var init_secrets = __esm({
  "src/cli/secrets.ts"() {
    "use strict";
    init_drizzle_orm();
    init_db2();
    init_schema();
    RESET4 = "\x1B[0m";
    BOLD4 = "\x1B[1m";
    DIM3 = "\x1B[2m";
    CYAN3 = "\x1B[36m";
    YELLOW2 = "\x1B[33m";
  }
});

// src/cli/index.ts
var [, , command, ...args] = process.argv;
async function main() {
  switch (command) {
    case "history": {
      const { runHistory: runHistory2 } = await Promise.resolve().then(() => (init_history(), history_exports));
      await runHistory2(args);
      break;
    }
    case "report": {
      const { runReport: runReport2 } = await Promise.resolve().then(() => (init_report(), report_exports));
      await runReport2(args);
      break;
    }
    case "export": {
      const { runExport: runExport2 } = await Promise.resolve().then(() => (init_export(), export_exports));
      await runExport2(args);
      break;
    }
    case "settings": {
      const { runSettings: runSettings2 } = await Promise.resolve().then(() => (init_settings(), settings_exports));
      await runSettings2(args);
      break;
    }
    case "secrets": {
      const { runSecrets: runSecrets2 } = await Promise.resolve().then(() => (init_secrets(), secrets_exports));
      await runSecrets2(args);
      break;
    }
    default: {
      const name = command ? `Unknown command: ${command}

` : "";
      process.stdout.write(
        `${name}Usage: chron <command> [options]

Commands:
  history         List sessions or show full log for a session
  report          Aggregate audit stats across sessions
  export          Export a session as markdown
  secrets         List detected secrets across sessions
  settings        View current configuration

Options (history):
  --limit=<n>     Max sessions to show (default: 20)
  <id-prefix>     Show full log for the session with this ID prefix

Options (report):
  --since=<range> Filter by date: 7d, 30d, or YYYY-MM-DD (default: all time)

Options (export / secrets):
  <id-prefix>     Scope to a single session
`
      );
      process.exit(command ? 1 : 0);
    }
  }
}
main().catch((err) => {
  process.stderr.write(`Error: ${err.message}
`);
  process.exit(1);
});
